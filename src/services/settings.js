/*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import config from "../config.js";
export const TOKEN_KEY = config.TOKEN_KEY;

export const defaultKey = () => localStorage.getItem("settings_" + TOKEN_KEY);

export const setConfigs = (configs) => {
  console.log(configs);
  localStorage.setItem("settings_" + TOKEN_KEY, JSON.stringify(configs));
};

export const deleteConfigs = () => {
  localStorage.removeItem("settings_" + TOKEN_KEY);
};

export const getConfigs = () => {
  if (defaultKey() !== null) {
    return JSON.parse(defaultKey());
  } else {
    return {
      sendSeen: true,
      rejectCall: false,
      notifySound: true,
      msgRejectCall: "",
      msgWelcome: "",
      attendantName: "",
    };
  }
};
