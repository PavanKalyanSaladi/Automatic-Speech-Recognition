FROM python:3.9.20-slim-bullseye
RUN mkdir -p /home/app
WORKDIR /home/app
RUN <<EOF
apt-get update && apt-get install -y ffmpeg
pip3 install fastapi uvicorn pydub pydantic SpeechRecognition
pip install jinja2
EOF
COPY main.py .
COPY app app/
EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload"]
