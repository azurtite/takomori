## 0.1.0 00001
以下の機能を実装
- プリンターの状態表示機能
- octoprintへのログイン、プリンター接続
- TOOLの温度制御機能
- Bedの温度表示機能
- サブパネル（外観のみ）

## 0.1.1(English)
### Function addition
- Implement file list panel.
- Implemented manual operation panel.
- Implemented temperature graph panel.

## 0.1.1(Japanese)
### 機能追加
- ファイルリストパネルを実装
- マニュアルオペレーションパネルを実装
- 温度グラフパネルを実装

## 0.1.1 00003(English)
### Bugfix \#00017
- Fixed an issue where the eject button was enabled when the extruder was cold.
- Fixed warning panel misalignment.
- Fixed sequence of updateTemperatureGraph.
- Fixed an issue where Octopi could not power off if power was lost while Power-btn was on.
- Fixed a bug that the bed temperature was not initialized when powering off.
### Improved functionality
- Improved sequence to avoid unnecessary alarms during power off process.
- Double start prevention.

## 0.1.1 00003(Japanese)
### バグ修正 \#00017
- エクストルーダーの温度が低い時に吐出ボタンが有効になっている問題を修正
- 警告パネルの位置ずれを修正
- updateTemperatureGraphのシーケンスを修正
- Power-btnがonになっている間にOctopiの電源が落ちた時パワーオフできない問題を修正
- パワーオフ時にベッド温度を初期化していない不具合を修正
### 機能改善
- パワーオフプロセス時に不必要なアラームが出ないようになるようにシーケンスを改善
- 2重起動防止