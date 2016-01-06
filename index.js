var t = require('taringajs');
var taringa = new t('USER_NAME', 'PASSWORD');
var _ = require('lodash');
var async = require('async');

taringa.on('logged',()=>{

	async.series([
		getListFollowers,
		getListFollowings
		],(err,results)=>{
			if(err)
				console.log(err);
			else{

				results = {'followers':results[0], 'followings':results[1] };

				var unfollowUsers= _.difference(results['followings'],results['followers']);

				async.forEachOf(unfollowUsers, (value, key, next) =>{
				  taringa.user.unfollow(value);
				  next();
				}, (err) => {
				  if (err) console.error(err.message);

				  	console.log("Altoke perro, dejaste de seguir a los que no te seguian!! \n ");
					  
				})
			}
		});
});

var getListFollowers=(callback)=>{

	taringa.user.getFollowers(null,(err,data)=>{

		return callback(null,_.pluck(data,'id'));
		
	});
};

var getListFollowings=(callback)=>{

	taringa.user.getFollowings(null,(err,data)=>{

		return callback(null,_.pluck(data,'id'));

	});	
}

