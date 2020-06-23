FROM node:14-slim

ENV PATH=$PWD/jdk8u212-b03/bin:$PATH
ENV ANDROID_HOME=/usr/local/android-sdk-linux
ENV PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
ENV PATH=$PATH:/opt/gradle/gradle-5.4.1/bin \
    NODE_ENV=development
ARG GRADLE_OPTS
ARG SDK_OPTS


WORKDIR /
RUN apt-get update \
    && apt-get install -y unzip android-tools-adb inotify-tools wget 
     
RUN wget https://github.com/AdoptOpenJDK/openjdk8-binaries/releases/download/jdk8u212-b03/OpenJDK8U-jdk_x64_linux_hotspot_8u212b03.tar.gz \
    && tar -xf OpenJDK8U-jdk_x64_linux_hotspot_8u212b03.tar.gz \
    && rm OpenJDK8U-jdk_x64_linux_hotspot_8u212b03.tar.gz \
    && mkdir $ANDROID_HOME \
    && wget -O sdk.zip "https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip" \
    && unzip -d $ANDROID_HOME sdk.zip \
    && rm sdk.zip 
RUN mkdir ~/.android \
    && touch ~/.android/repositories.cfg \
    && sdkmanager "platform-tools" $SDK_OPTS \
    && yes | sdkmanager --licenses \
    && wget https://services.gradle.org/distributions/gradle-5.4.1-bin.zip \
    && mkdir /opt/gradle \
    && unzip -d /opt/gradle gradle-5.4.1-bin.zip \
    && rm gradle-5.4.1-bin.zip

WORKDIR /srv
