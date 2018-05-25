'use strict';

var SampleContract = function() {
	// 所有用户得分
	LocalContractStorage.defineMapProperty(this, "scoreMap");
	// 前十用户得分
	LocalContractStorage.defineMapProperty(this, "topMap");
};

SampleContract.prototype = {
	init : function() {
	},
	save : function(score, name) {
		var from = Blockchain.transaction.from;
		// 将数据存储到scoreMap中，并序列化到链上
		var item = {
			score : score,
			name : name,
			from : from,
			time : new Date().getTime(),
		};
		
		this.scoreMap.put(from, item);
		var topList = this.topMap.get("topList");
		if (!topList){
			topList = []
		}
		// 少于10个，直接放入
		if (topList.length < 10){
			topList.push(item);
		} else{
			// 循环topList，如果有小于当前得分的则删除，并把当前得分放入
			for ( var i in topList){
				if (topList[i].score < score){
					topList.splice(i, 1, item);
					break;
				}
			}
		}
		// 按得分排序
		topList.sort(function(a, b) {
			return b.score - a.score;
		});
		this.topMap.put("topList", topList);
	},
	read : function() {
		// 读取前十数据
		return this.topMap.get("topList");
	},
	get : function(from) {
		// 读取某用户数据
		return this.scoreMap.get(from);
	}
};

module.exports = SampleContract;
