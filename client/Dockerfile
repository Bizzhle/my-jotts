FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl git lsb-release

RUN curl -sL https://storage.googleapis.com/flutter-sdk/install/stable.tar.gz | tar -zxvf - -C /opt

ENV PATH="/opt/flutter/bin:$PATH"

RUN flutter doctor -v

CMD ["flutter", "run"]