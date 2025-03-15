# Use the base image with Python and Scrapy pre-installed
FROM badouralix/python-scrapy

# Set the working directory inside the container
WORKDIR /crawler_code

# Copy the requirements file into the container
COPY ./docker/scrapy/requirements.txt .

# Install the necessary Python packages including redis
RUN pip install -r requirements.txt

# Copy the entire project directory into the container
COPY ./scrapy .

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
      telnet

# Define the default command to run when the container starts
#CMD scrapy runspider /crawler_code/cs4u/spiders/hahu.py
