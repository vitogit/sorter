# Sorter

Sorter is a webapp to organize ideas, tasks and information using bullet points and hashtags.

## How it works

#### Write your notes following a hierarchy with bullets points 
![Sorter in action](http://i65.tinypic.com/123umps.png)

#### Add hashtags to your notes and filter by hashtags or words to just focus on what you need
![Sorter with tags](http://i66.tinypic.com/14u9raf.png)

#### Sync your info with Google Drive.
 Click the save button and it will create a new document in your google drive called: sorter_notes. It will be loaded automatically when the app start.
 It uses my library gSyncDrive for sync with Google Drive Api v3 https://github.com/vitogit/gDriveSync.js 

#### Default hashtags

- read-later: something that you want to read later
- bookmark: articles or internet links
- tip: something intersting that you found
- goal: maybe a long term goal with a lot of actions and sub goals
- action: something that you have to do, some task, call, etc
- idea: ideas to develop in the future
- p1, p2, p3: add priority to your tasks so then you can filter important tasks



##### SmartTags: they are a special kind of hashtag with buildin functionality:
- $todo : the note is painted yellow
- $completed: the note is painted green
- $journal: the current date is added and so you could filter by date.  [not implemented yet]

 
##### You can choose between different views. [not implemented yet]
- Tasks:
- Journal:
