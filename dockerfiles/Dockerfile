FROM ubuntu

RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y tzdata nginx
RUN ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime
RUN dpkg-reconfigure --frontend noninteractive tzdata

