from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
import mysql.connector
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

MODEL_PATH = "ideal_study_model.pkl"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "AndroidStudio5522",
    "database": "llu"
}

def calculate_duration(intervals):
    try:
        parsed = json.loads(intervals)
        return sum(end - start for start, end in parsed) / 60
    except:
        return 0

def count_interruptions(intervals):
    try:
        parsed = json.loads(intervals)
        return max(0, len(parsed) - 1)
    except:
        return 0

def calculate_avg_gap(intervals):
    try:
        parsed = json.loads(intervals)
        if len(parsed) < 2:
            return 0
        gaps = [parsed[i][0] - parsed[i - 1][1] for i in range(1, len(parsed))]
        return sum(gaps) / len(gaps)
    except:
        return 0

def extract_day_info(row):
    try:
        parsed = json.loads(row)
        if len(parsed) == 0:
            return None, None
        start_time = datetime.fromtimestamp(parsed[0][0] / 1000)
        return start_time.strftime("%A"), categorize_time_of_day(start_time.hour)
    except:
        return None, None

def categorize_time_of_day(hour):
    if hour < 12:
        return "morning"
    elif 12 <= hour < 18:
        return "afternoon"
    else:
        return "evening"

def fetch_combined_data(user_id=None):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    query = "SELECT timeIntervals, isCompleted, quality, user_id FROM timers"
    if user_id:
        query += f" WHERE user_id = {user_id}"
    cursor.execute(query)
    timer_data = cursor.fetchall()

    query = "SELECT timeIntervals, quality, user_id FROM stopwatches"
    if user_id:
        query += f" WHERE user_id = {user_id}"
    cursor.execute(query)
    stopwatch_raw = cursor.fetchall()
    stopwatch_data = [
        {**entry, "isCompleted": 0} for entry in stopwatch_raw
    ]

    query = "SELECT emotions, user_id, date FROM emotions"
    if user_id:
        query += f" WHERE user_id = {user_id}"
    cursor.execute(query)
    emotion_data = cursor.fetchall()

    conn.close()

    combined_data = timer_data + stopwatch_data
    df = pd.DataFrame(combined_data)

    df["isCompleted"] = df["isCompleted"].apply(lambda x: -1 if x == 0 else x)

    df["quality"] = df["quality"].fillna(3)

    emotions_df = pd.DataFrame(emotion_data)
    if not emotions_df.empty:
        emotions_df["date"] = pd.to_datetime(emotions_df["date"])
        df["emotions"] = df["user_id"].apply(lambda uid: get_latest_emotion_for_user(uid, emotions_df))
    else:
        df["emotions"] = None

    return df

def get_latest_emotion_for_user(user_id, emotions_df):
    user_emotions = emotions_df[emotions_df["user_id"] == user_id]
    if user_emotions.empty:
        return None
    latest = user_emotions.sort_values(by="date", ascending=False).iloc[0]
    return latest["emotions"]

def train_model(user_id=None):
    df = fetch_combined_data(user_id)
    if df.empty:
        return None, "No data available."

    df = df[df["timeIntervals"].apply(lambda x: isinstance(x, str) and len(x.strip()) > 0)]
    df["duration"] = df["timeIntervals"].apply(calculate_duration)
    df["num_interruptions"] = df["timeIntervals"].apply(count_interruptions)
    df["avg_gap"] = df["timeIntervals"].apply(calculate_avg_gap)
    df[["day", "time_of_day"]] = df["timeIntervals"].apply(lambda x: pd.Series(extract_day_info(x)))
    df["emotion_code"] = df["emotions"].astype("category").cat.codes
    print(df.head(10))

    day_stats = df.groupby("day")["duration"].mean().sort_values(ascending=False)
    tod_stats = df.groupby("time_of_day")["duration"].mean().sort_values(ascending=False)

    ideal_day = day_stats.idxmax() if not day_stats.empty else None
    ideal_time_of_day = tod_stats.idxmax() if not tod_stats.empty else None

    X = df[["num_interruptions", "avg_gap", "emotion_code", "quality"]]
    y = df["duration"]

    model = RandomForestRegressor()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    return model, {"ideal_day": ideal_day, "ideal_time_of_day": ideal_time_of_day}

def get_latest_combined_features(user_id):
    df = fetch_combined_data(user_id)
    if df.empty:
        return None, "No data"

    df = df[df["timeIntervals"].apply(lambda x: isinstance(x, str) and len(x.strip()) > 0)]
    df["num_interruptions"] = df["timeIntervals"].apply(count_interruptions)
    df["avg_gap"] = df["timeIntervals"].apply(calculate_avg_gap)
    df["emotion_code"] = df["emotions"].astype("category").cat.codes
    df["quality"] = df["quality"].fillna(3)
    print(df.head(10))
    latest = df.iloc[-1]
    return [[latest["num_interruptions"], latest["avg_gap"], latest["emotion_code"], latest["quality"]]], None

@app.route('/train', methods=['POST'])
def train():
    user_id = request.json.get("user_id")
    model, extras = train_model(user_id)
    if model is None:
        return jsonify({"error": extras}), 400
    return jsonify({"message": "Model trained successfully.", **extras})

@app.route('/predict', methods=['POST'])
def predict():
    if not os.path.exists(MODEL_PATH):
        return jsonify({"error": "Model not trained yet."}), 400

    user_id = request.json.get("user_id")
    try:
        features, error = get_latest_combined_features(user_id)
        if features is None:
            return jsonify({"error": error}), 400

        model = joblib.load(MODEL_PATH)
        prediction = model.predict(features)[0]
        return jsonify({"idealDuration": round(prediction, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
