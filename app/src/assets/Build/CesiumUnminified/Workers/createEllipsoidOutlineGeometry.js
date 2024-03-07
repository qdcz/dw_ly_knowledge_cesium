/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.111
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  EllipsoidOutlineGeometry_default
} from "./chunk-6LG4PY2M.js";
import "./chunk-ZERWARDV.js";
import "./chunk-CKOGHQ6J.js";
import "./chunk-EH2PEDWL.js";
import "./chunk-3R5RPSYS.js";
import "./chunk-XKGSTUQO.js";
import "./chunk-DNCKFFNR.js";
import "./chunk-IQCBK4CE.js";
import "./chunk-UJ76JVUZ.js";
import "./chunk-54GSYZWT.js";
import "./chunk-A3TYRSRJ.js";
import "./chunk-XNRYWRVT.js";
import "./chunk-YK5RU5AO.js";
import "./chunk-N73NY3KY.js";
import "./chunk-WYMW5NZB.js";
import {
  defined_default
} from "./chunk-FMN2NHBU.js";

// packages/engine/Source/Workers/createEllipsoidOutlineGeometry.js
function createEllipsoidOutlineGeometry(ellipsoidGeometry, offset) {
  if (defined_default(ellipsoidGeometry.buffer, offset)) {
    ellipsoidGeometry = EllipsoidOutlineGeometry_default.unpack(
      ellipsoidGeometry,
      offset
    );
  }
  return EllipsoidOutlineGeometry_default.createGeometry(ellipsoidGeometry);
}
var createEllipsoidOutlineGeometry_default = createEllipsoidOutlineGeometry;
export {
  createEllipsoidOutlineGeometry_default as default
};
