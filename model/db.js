/**

 * http://mongodb.github.io/node-mongodb-native

 * http://mongodb.github.io/node-mongodb-native/3.0/api/
 */

//DB库
var MongoDB=require('mongodb');
var MongoClient =MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;

var Config=require('./config.js');

class Db{

    static getInstance(){   /*1、单例  多次实例化实例不共享的问题*/

        if(!Db.instance){
            Db.instance=new Db();
        }
        return  Db.instance;
    }

    varructor(){

        this.dbClient=''; /*属性 放db对象*/
        this.connect();   /*实例化的时候就连接数据库*/

    }

    connect(){  /*连接数据库*/
      var _that=this;
      return new Promise((resolve,reject)=>{
          if(!_that.dbClient){         /*1、解决数据库多次连接的问题*/
              MongoClient.connect(Config.dbUrl,(err,client)=>{

                  if(err){
                      reject(err)

                  }else{

                      _that.dbClient=client.db(Config.dbName);
                      resolve(_that.dbClient)
                  }
              })

          }else{
              resolve(_that.dbClient);

          }


      })

    }

    find(collectionName, json1, json2, json3){
        if (arguments.length == 2) {
            var attr = {};
            var skipNum = 0;
            var pageSize = 0;

        } else if (arguments.length == 3) {
            var attr = json2;
            var skipNum = 0;
            var pageSize = 0;
        } else if (arguments.length == 4) {
            var attr = json2;
            var page = json3.page || 1;
            var pageSize = json3.pageSize || 20;
            var skipNum = (page - 1) * pageSize;
        } else {
            console.log('传入参数错误');
        }

        return new Promise((resolve, reject) => {

            this.connect().then((db) => {
                //var result=db.collection(collectionName).find(json);
                var result = db.collection(collectionName).find(json1, { fields: attr }).skip(skipNum).limit(pageSize);
                result.toArray(function (err, docs) {

                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })

            })
        }) 
    }

    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{


                this.connect().then((db)=>{

                    //db.user.update({},{$set:{}})
                    db.collection(collectionName).updateOne(json1,{
                        $set:json2
                    },(err,result)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    })

                })

        })

    }
    insert(collectionName,json){
        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                db.collection(collectionName).insertOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })


            })
        })
    }

    remove(collectionName,json){

        return new  Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                db.collection(collectionName).removeOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{

                        resolve(result);
                    }
                })


            })
        })
    }

    //统计数量的方法
    count(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {

                db.collection(collectionName).count(json, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {

                        resolve(result);
                    }
                })


            })
        })
    }
    getObjectId(id){    /*mongodb里面查询 _id 把字符串转换成对象*/

        return new ObjectID(id);
    }
}


module.exports=Db.getInstance();
