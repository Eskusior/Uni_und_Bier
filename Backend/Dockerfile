FROM python:3

# Add Script
ADD server.py /

# Install app dependencies
RUN pip install flask flask-jsonpify flask-sqlalchemy flask-restful flask-cors pystardog

EXPOSE  5002
CMD ["python", "./server.py", "-p 5002"]

