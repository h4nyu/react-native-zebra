FROM node:15-slim

ENV ANDROID_HOME=/usr/lib/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
ENV NODE_ENV=development

ARG GRADLE_OPTS
WORKDIR /
RUN apt-get update \
    && mkdir -p /usr/share/man/man1 \
    && apt-get install -y default-jdk curl unzip
RUN curl -O https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip \
    && unzip -o commandlinetools-linux-6609375_latest.zip -d $ANDROID_HOME \
    && rm commandlinetools-linux-6609375_latest.zip \
    && rm -rf /var/lib/apt/lists/* \
    && yes | sdkmanager --sdk_root=$ANDROID_HOME $GRADLE_OPTS "platform-tools"  
WORKDIR /srv
