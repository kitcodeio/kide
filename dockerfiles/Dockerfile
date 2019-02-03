FROM ubuntu
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y apt-utils nginx tzdata
RUN ln -fs /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
RUN dpkg-reconfigure --frontend noninteractive tzdata
