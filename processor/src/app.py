from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/health", methods=["GET"])
def health():
    return {"status": "python processor running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081)
