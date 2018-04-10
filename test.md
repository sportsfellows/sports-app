// Review: What is this file? If it isn't needed you should cull it.

### `Sporting Event Routes`
#### POST: `/api/sportingevent`
Add a sporting event with the properties `name`, `desc`, `createdOn`, and `tags`. The property `createdOn` is generated automatically and the `tags` property is available for any extra information that a user may want to add.
```
http POST :3000/api/sportingevent 'Authorization:Bearer <token>' sportingEventName='<event name>' desc='<description>'
```
After a successful POST, you receive an object of the new sporting event you created, like the example below:
```
{
    "__v": 0, 
    "_id": "5aa9acbe42358a6e7b6a6450", 
    "createdOn": "2018-03-14T23:14:06.602Z", 
    "desc": "some text and stuff", 
    "sportingEventName": "baseball", 
    "tags": []
}
```
#### GET: `/api/sportingevent/<sporting event id>`
```
http GET :3000/api/sportingevent/<sporting event id> 'Authorization:Bearer <token>'
```
This will return an object of your sporting event, like the example below:
```
{
    "__v": 0, 
    "_id": "5aa9acbe42358a6e7b6a6450", 
    "createdOn": "2018-03-14T23:14:06.602Z", 
    "desc": "some text and stuff", 
    "sportingEventName": "baseball", 
    "tags": []
}
```
