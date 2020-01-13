steps to make this work:

1. Install Dependencies

   ```
   yarn
   yarn build
   ```

2. Make sure you register your app with the slack events api and update the
/packages/protobot/.env.sample with your credentials and save it as .env.
Instructions can be found [here](https://bottender.js.org/docs/channel-slack-setup)

3. Test locally from the protobot dir with yarn start. Use ngrok to forward your
   port 3333. Update your slack config with the ngrok url + /webhooks/slack

4. Your protobot needs to be initialized first. This can be done with the
   grapqhl api. Docs are in the playground. But it's basically one command:

   ```graphql
   mutation Init($input:BWAEvent!){
     sendEvent(event: $input){
       currentState
     }
   }
   ```

   and input variables

   ```json
   {
     "input":{
        "eventType": "INITIALIZED",
        "payload": {
          "botName": "HELOO",
          "cassettes": ["stgjasds"]
        }
      }
    }
   ```

5. Hook your own code into the botframe/machine/routes module. I'm using the
   bottender botframe work under the hood. You only have to add the correct
   actions. Docs are [here](https://bottender.js.org/docs/the-basics-actions)
   and [here](https://bottender.js.org/docs/the-basics-routing)

6. There is a dockerfile in the root dir. This can be used to deploy your
   protobot once your done.

   ```
   docker build -t @offcourse/protobot .
   docker run docker run -p 80:3333 -d offcourse/protobot
   ```



