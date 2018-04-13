# Bracket-Busters

### 4/11/18

## High Level

This is really nicely done. You have a massive codebase, yet you manage the relationships very well. Overall the code is structured well and looks like it should. There are a few instances where you have some really long lines that should be broken up, but that's mostly because your models have so many properties. It's awesome that you were able to get such a high test coverage rate considering how much code you have, well done! You went above and beyond with this, and incorporated new techniques and functionality that we didn't explore in class - nice!

I'm super excited to see the React front end!

## General Considerations for Refactor

- Your codebase is huge. You have a lot of logic, and lots of clever logic. Clever logic is awesome, but it means that it may not be as easy to understand when you go back to it. I would strongly encourage you to start adding more helpful comments into your code. Leave yourself an explanation as to WHY you did things a certain way. It will help you out down the road.

- lots of naming inconsistencies between `id` and `Id` and `ID`

- Break super long lines into multiple lines

- Remove long messy comments above your routes

- You should always check that what was returned by mongoose exists before acting on it or sending it back to the client. For example, if you give mongoose a properly formatted ObjectID (like you just happened to have an old one saved for some reason) that doesn't exist, mongoose won't throw an error, it will just return null from the promise.

- You have a handful of instances where you put your `.catch()` before your `.then()` which could create async issues

- You have a handful of async calls in the middle of your routes that don't have any catches on them. If those break, you'll get unhandled promise rejections which could lead to problems.

- Use object destructuring to clean up some of your calls

- Add more methods to your models so that you can just call them in your routes, making your routes cleaner.

- You have lots of nesting in your routes which at points makes it hard to read. Generally it is nice to keep your async calls at the same level. There are instances where you may need to nest in, but ask yourself if it is necessary to accomplish your goals.

- Avoid calling your image root folder `public` as that name generally has a connotation which is not consistent with your use.

- If you run your tests with `jest -i --verbose` you can see that you have some nesting issues with your tests. For example, in your `UserPick` tests your `PUT` tests are nested inside of your `GET` routes. You need to be very careful with that, because that can create weird issues that you don't expect.

## Specific Notes in Code

I have provided more specific feedback in most of your files. Please read them carefully. Most of the time if I make a comment in one place it applies in numerous places across your files, but generally I only made that specific type of comment in the one spot. It will be on you to apply these notes/thoughts across your work (if you choose to). 

I've started all of my comments with `// Review:`, so you can search your project for that with `cmd + shift + f` and jump straight to all of my comments.
