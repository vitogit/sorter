# Sorter

Sorter is a webapp to organize ideas, tasks and information using bullet points and hashtags.

## How it works

#### Write your notes following a hierarchy with the bullets points. 
- House 
  - buy bread and milk
  - fix table 
    - buy nails
    - do the job
- Trip to LA 
  - check available dates
  - buy tickets
  - buy 2 bags

#### Sync your info with Google Drive.
 Click the save button and it will create a new document in your google drive called: sorter_notes. IT will be loaded automatically when the app start.
 It uses my library gSyncDrive for sync with Google Drive Api v3 https://github.com/vitogit/gDriveSync.js 


#### Add hashtags to your notes
- House 
  - buy bread and milk **#task**
  - fix table **$todo**
    - buy nails
    - do the job
- Trip to LA **#goal**
  - check available dates
  - buy tickets
  - buy 2 bags

#### Filter by hashtags or words to just focus on what you need

##### SmartTags: they are a special kind of hashtag with buildin functionality:
- $todo : the note is painted yellow
- $completed: the note is painted green
- $journal: the current date is added and so you could filter by date.  [not implemented yet]

 
##### You can choose between different views. [not implemented yet]
- Tasks:
- Journal: 
-
