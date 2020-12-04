FROM node:15-slim

ENV ANDROID_HOME=/usr/local/android-sdk-linux
ENV PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
ENV NODE_ENV=development

ARG GRADLE_OPTS
ARG SDK_OPTS
RUN echo insecure >> $HOME/.curlrc
SHELL ["/bin/bash", "-c"]
WORKDIR /
RUN apt-get update \
    && apt-get install -y zip curl wait-for-it \
    && rm -rf /var/lib/apt/lists/* \
    && curl -s "https://get.sdkman.io" | bash \
    && source /root/.sdkman/bin/sdkman-init.sh \
    && sdk install java 8.0.275-amzn \
    && sdk install gradle \
    && mkdir $ANDROID_HOME \
    && curl -o sdk.zip "https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip" \
    && unzip -d $ANDROID_HOME sdk.zip \
    && rm sdk.zip \
    && mkdir ~/.android \
    && touch ~/.android/repositories.cfg \
    && sdkmanager "platform-tools" $SDK_OPTS \
    && yes | sdkmanager --licenses

WORKDIR /srv
