var t = require('taringajs');
var taringa = new t('USUARIO', 'PASSWORD');
var _ = require('lodash');
var async = require('async');

var interval = 1; 

taringa.on('logged',()=>{

	getUsers(function(err,results){

		if(err)
			console.log(err);
		else{

			var unfollowUsers= _.difference(results['followings'],results['followers']);

			async.forEachOfSeries(unfollowUsers, (value, key, next) =>{

			  setTimeout(()=>{
				taringa.request('http://api.taringa.net/user/view/'+value,function(err,res,body){
			  	 if(!err){
			  		taringa.user.unfollow(value);
			  		console.log('dejaste de seguir a : ', JSON.parse(body).nick);
			  	 }
			  	 next();
			    });
			    	
			  },interval*1000);	
			
			}, (err) => {
			  if (err) console.error(err.message);

			  	console.log("Altoke perro, dejaste de seguir a los que no te seguian!! \n ");
				  
			})
		}

	})
		
});


var getUsers=(cb)=>{

	taringa.user.getStats(null,(err,data)=>{
		if(err)
			return cb(error);

		var followingsPages = Math.ceil(data.followings  / 50 );
		var followersPages = Math.ceil(data.followers / 50 );
		var arr = [];
		var arr2 = [];

		for(var i =1 ; i<=followingsPages;i++){
			arr[i-1]=i;
			
		}
		for(var i =1 ; i<=followersPages;i++){
			arr2[i-1]=i;
		}
		
		var followings = [];
		var followers = [];

		async.series([
			function(callback){
				async.forEach(arr,(page,next)=>{
					taringa.user.getFollowings(null,page,(err,data)=>{
						followings = followings.concat(data);
						next();		
					});
				},function(err){
					if(!err)
						callback();
				})	
			},function(callback){

				async.forEach(arr2,(page,next)=>{
					taringa.user.getFollowers(null,page,(err,data)=>{
						followers = followers.concat(data);
						next();
					});	
				},function(err){
					if(!err)
						callback();
				})	
			}],

			function(err){
				if(err)
					return console.log(err);
			return cb(null,{followers:_.pluck(followers,'id'),followings:_.pluck(followings,'id')});
		})		
	})
};
