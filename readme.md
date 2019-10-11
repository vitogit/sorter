# Sorter

Sorter is a webapp to organize ideas, tasks and information using bullet points and hashtags.

## How it works

#### Write your notes following a hierarchy with bullets points 
![Sorter in action](https://user-images.githubusercontent.com/5280619/66678930-5dab9280-ec43-11e9-833f-e87dbbcfbd15.png)

#### Add hashtags to your notes and filter by hashtags or words to just focus on what you need
![Sorter with tags](https://user-images.githubusercontent.com/5280619/66678925-5ab0a200-ec43-11e9-8d21-aee7658b1084.png)

If you write `&` anywhere in the filter it will perform an AND filter: 
`ex: & #task $todo it will search notes that have both hashtags.`
in other case it will perform and OR filter.
`ex: #task $todo it will search notes that have any of the hashtags.`


#### Sync your info with Google Drive.
 Click the save button and it will create a new document in your google drive called: sorter_notes. It will be loaded automatically when the app start.
 It uses my library gSyncDrive for sync with Google Drive Api v3 https://github.com/vitogit/gDriveSync.js 

#### Suggested hashtags

- read-later: something that you want to read later
- bookmark: articles or internet links
- tip: something interesting that you found
- goal: maybe a long term goal with a lot of actions and sub goals
- action: something that you have to do, some task, call, etc
- idea: ideas to develop in the future
- p1, p2, p3: add priority to your tasks so then you can filter important tasks

##### SmartTags: they are a special kind of hashtag with buildin functionality:
- $todo : the note is painted yellow
- $completed: the note is painted green
- $journal: the current date is added and so you could filter by date.  [not implemented yet]
- For default journal and completed task are hidden, you can uncheck them in the sidebar.

##### Notebooks
You can create new notebooks (google docs) and access them easily from the left menu. Just write the name and click "save new"
There is a default notebook called `home`, all notebooks has a prefix: sorter_notes_ so that's is how they look in google drive.

Also you can add @my_notebook to your notes and when clicked it will redirect to the notebook called my_notebook

##### Writing notes and taking shortcuts
Make sure that you are always writing bullet points. Click in the bullet list icon if is not set.

- `enter`: It will create a new bullet point
- `tab` : it will move the bullet to the right
- `shift+tag`: it will move the bullet to the left

- `ctrl+alt+c` : add the $complete tag to the current tag and removes the #task and $todo tags
- `ctrl+alt+s` : add #current_sprint and #sprint2 to the current note, when current sprint is 2
- `ctrl+alt+f` : focus on the filter box
- `alt+click (on bullet point)`: collapse/expand notes

- `ctrl+alt+x` : cut note
- `ctrl+alt+v` : paste note


##### Sprints and tasks
You can organize your tasks by sprint, adding the #sprint1 hashtag and #current_sprint. For example, you have 3 tasks to complete this week and 2 to complete next week. So for the first 3 you add the hashtag #sprint1 and #current_sprint and for the last 2 you add just the hash_tag #sprint2. Then the next week, you can use the "change sprint" functionality, write 2 and click "change sprint" on the upper left sidebar. This will add #current_sprint to the #sprint2 hashtags.

## Installation

It uses my library [gDriveSync.js](https://github.com/vitogit/gDriveSync.js) for syncing with google drive, so first you will need to:
 Add your api client_id to config.js. You can get the client id following the instruction from step1 here https://developers.google.com/drive/v3/web/quickstart/js

Then just install the app: 

```
npm install 
npm start
```

go to http://localhost:4000

To run tests go to 
http://localhost:4000/test/
