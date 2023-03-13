#!/bin/bash

# Quizfreely (quizfreely.ehan.dev)
# Copyright (c) 2022-2023 Ehan Ahamed and contributors
# Licensed under the Universal Permissive License v1.0
# https://src.ehan.dev/quizfreely/LICENSE.txt

list = $1
output = $2

{ xargs cat < $1 ; } > $2
