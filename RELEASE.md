# Index
- [Index](#index)
- [0.1.0 00001](#010-00001)
- [0.1.1](#011)
	- [0.1.1(English)](#011english)
		- [Function addition](#function-addition)
	- [0.1.1(Japanese)](#011japanese)
		- [機能追加](#機能追加)
	- [0.1.1 00003(English)](#011-00003english)
		- [Bugfix #00017](#bugfix-00017)
		- [Improved functionality](#improved-functionality)
	- [0.1.1 00003(Japanese)](#011-00003japanese)
		- [バグ修正 #00017](#バグ修正-00017)
		- [機能改善](#機能改善)
- [0.1.2](#012)
	- [0.1.2 00001(English)](#012-00001english)
		- [New function](#new-function)
		- [Bug fixes #0017](#bug-fixes-0017)
		- [Improved functionality](#improved-functionality-1)
	- [0.1.2 00001(Japanese)](#012-00001japanese)
		- [新機能](#新機能)
		- [バグ修正 #0017](#バグ修正-0017)
		- [機能改善](#機能改善-1)
- [0.1.3](#013)
	- [0.1.3 00001(English)](#013-00001english)
		- [new function](#new-function-1)
		- [Bug fixes](#bug-fixes)
		- [Functional improvement](#functional-improvement)
	- [0.1.3 00001(Japanese)](#013-00001japanese)
		- [新機能](#新機能-1)
		- [バグ修正](#バグ修正)
		- [機能改善](#機能改善-2)

# 0.1.0 00001
以下の機能を実装
- プリンターの状態表示機能
- octoprintへのログイン、プリンター接続
- TOOLの温度制御機能
- Bedの温度表示機能
- サブパネル（外観のみ）

# 0.1.1
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

# 0.1.2
## 0.1.2 00001(English)
### New function
- Implement file move logic
### Bug fixes \#0017
- Fixed actionPowerBtnClick to be false when login failed
- Fixed the problem that the set job file name remains displayed when the power is turned off while job.select is selected.
- Fixed so that window size cannot be changed
### Improved functionality
- Added debug messages to postProcess
- Added debug message to getFilelist
- Prevention of double activation of intervalIDprn
- Changed to display printer unconnected in the file list.
- Changed to show that there are no files on the server## 0.1.2 00001(Japanese)

## 0.1.2 00001(Japanese)
### 新機能
- ファイル移動ロジックを実装
### バグ修正 \#0017
- ログイン失敗時にactionPowerBtnClickをfalseにするように修正
- job.selectしたまま、パワーオフすると設定したjobファイル名表示が残る問題を修正
- ウィンドウサイズを変更できなくなるように修正
### 機能改善
- postProcessにデバックメッセージを追加
- getFilelistにデバックメッセージを追加
- intervalIDprnの2重起動防止
- プリンター未接続をファイルリストに表示するように変更
- サーバー上のファイルがないことを表示するように変更

# 0.1.3
## 0.1.3 00001(English)
### new function
- Implement each dialog in submenu
	- Large screen manual operation
	- Send G-code
	- Large screen temperature graph
	- log viewer
- Implemented settings dialog
### Bug fixes
- Fixed a bug that the icon color does not change when executing getFilelist
- Fixed behavior when gCode Analysis parameter does not exist
### Functional improvement
- Fixed a bug that the file panel display was strange
- Changed setting storage location from file to localStorage
- Changed to display that there is no print file when there is no print file on the octopi server.
- remove debug code
- Fixed file-related icons not operable when printing, now operable except for the file being printed
- Added a function to cancel printing by operating the printer icon
- Modified the code of the manual operation screen

## 0.1.3 00001(Japanese)
### 新機能
- サブメニューの各ダイアログを実装
	- 大画面マニュアル操作
	- Gコード送信
	- 大画面温度グラフ
	- ログビューアー
- 設定ダイアログを実装
### バグ修正
- getFilelist実行時にアイコン色が変わらない不具合を修正
- gCode Analysisパラメーターが存在しないときの挙動を修正
### 機能改善
- ファイルパネル表示がおかしくなる不具合を修正
- 設定の保存場所をファイルからlocalStorageに変更
- octopiサーバーにプリントファイルが存在しないとき、ファイルが無いことを表示するように変更
- デバッグコードを削除
- 印刷時にファイル関連アイコン操作不可能にしていたものを、印刷中のファイル以外は操作可能に修正
- プリンターアイコンを操作してプリントキャンセルできる機能を追加
- マニュアル操作画面のコードを改修