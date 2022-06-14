/*
 * Copyright 2022 WPPConnect Team
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
import {defaultKey, getToken, TOKEN_KEY} from "../services/auth";

const key = JSON.parse(defaultKey());

const configHeader = () => {
    if (key !== null) {
        return {headers: {Authorization: `Bearer ${getToken()}`}};
    }
};

export default configHeader;