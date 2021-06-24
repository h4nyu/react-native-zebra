FROM node:15-slim

ENV ANDROID_HOME=/usr/lib/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
ENV NODE_ENV=development
ENV JAVA_HOME=/root/.sdkman/candidates/java/current

ARG SDK_OPTS
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl unzip zip
    
RUN echo insecure >> $HOME/.curlrc
SHELL ["/bin/bash", "-c"]
WORKDIR /
RUN curl -s "https://get.sdkman.io" | bash \
    && source /root/.sdkman/bin/sdkman-init.sh \
    && sdk install java 8.0.275-amzn \
    && sdk install gradle \
    && curl -O https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip \
    && unzip -o commandlinetools-linux-6609375_latest.zip -d $ANDROID_HOME \
    && rm commandlinetools-linux-6609375_latest.zip \
    && rm -rf /var/lib/apt/lists/* \
    && yes | sdkmanager --sdk_root=$ANDROID_HOME $SDK_OPTS "platform-tools"  
WORKDIR /srv
