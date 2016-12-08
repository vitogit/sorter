# Sorter

Sorter is a webapp to organize ideas, tasks and information using bullet points and hashtags.

## How it works

#### Write your notes following a hierarchy with bullets points 
![Sorter in action](http://i64.tinypic.com/2lk7lfk.png)

#### Add hashtags to your notes and filter by hashtags or words to just focus on what you need
![Sorter with tags](http://i66.tinypic.com/2ccplbs.png)

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

##### Notebooks
You can create new notebooks (google docs) and access them easily from the left menu. Just write the name and click "save new"
There is a default notebook called `home`, all notebooks has a prefix: sorter_notes_ so that's is how they look in google drive.

Also you can add @my_notebook to your notes and when clicked it will redirect to the notebook called my_notebook

##### Shortcuts

- `ctrl+alt+c` : add the $complete tag to the current tag and removes the #task and $todo tags
- `ctrl+alt+s` : add #current_sprint and #sprint2 to the current note, when current sprint is 2
- `ctrl+alt+f` : focus on the filter box

##Installation

```
npm install 
npm start
```

go to http://localhost:4000

To run tests go to 
http://localhost:4000/test/
