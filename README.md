# Automatic-Speech-Recognition

This is an ML project which I have contributed to my PG-AI/ML in IIIT HYD.	<br/>
This model is to automate the audio to text convertion with live streaming as well.

As it is only available in my host machine, by using docker - it can run Anywhere, Anyone, Anytime.

The Dockerfile is the foundation that is used to create the docker image and upload it in the docker hub.

Clone the git repository--  <br/>
```
git clone https://github.com/PavanKalyanSaladi/Automatic-Speech-Recognition.git
```

Build the docker image by running the below command--  <br/>
```
cd Automatic-Speech-Recognition
docker build . -t asr:v5.0
```

Run the docker image by running in the port 8000--  <br/>
```
docker run -d --name asr_hindi -p 8000:8000 asr:v5.0
```

Now you can access it in your host machine--    <br/>
```
localhost:8000
```

---
Instead you can directly pull the public image that I created in my docker hub--  <br/>
```
docker run -d --name asr_hindi -p 8000:8000 pavankalyan2001/asr:latest
```
