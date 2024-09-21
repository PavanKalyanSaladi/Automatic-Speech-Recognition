FROM python:3.9.20-alpine
RUN mkdir -p /home/app
WORKDIR /home/app
RUN <<EOF
pip3 install fastapi uvicorn pydub pydantic SpeechRecognition
EOF
COPY main.py .
COPY app .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload"]
