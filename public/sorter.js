var Sorter = function(editorId) {
  this.editor = editorId;
  
  //current_text: space separated string, by which will filter the elements 
  //tagsToHide: array of tags to hide
  //type_and: filter using and instead of or
  this.filter = function(current_text, tagsToHide, type_and) {

    current_text = current_text || ''
    tagsToHide = tagsToHide || []
    var self = this
    var hashtags = current_text.replace(/&/g, '').replace(/  +/g, ' ').replace(/\$/g, '\\$').split(' ')
    hashtags = hashtags.filter(function(h){ return h != "" });
    var tagsToHide = tagsToHide.map(function(e) {
                        return e.replace(/\$/g, '\\$');
                     })
    tagsToHide = tagsToHide.filter(function(h){ return h != "" });

    //filter using OR 
    var regex = hashtags.join("|")
    if (type_and) {     //filter using AND
      regex = hashtags.map(function(e) {
                return '(?=.*'+e+')'
              }).join("")
    }

    $(this.editor).find('li').hide()
    $(this.editor).find('li').each(function() {
      var li_text = $(this).clone().children('ul').remove().end().html();
      if (new RegExp(regex).test(li_text)) {
        $(this).show()
        $(this).parents().show()
        $(this).find('li').show()
      }

      if (tagsToHide.length && new RegExp(tagsToHide.join("|")).test(li_text)) {
        $(this).hide()
        $(this).find('li').hide()
      }
    })
  }

  this.parseHashtags = function() {
    var initText = $(this.editor).html()
    var parsedText = initText.replace( /#(\w+)\b(?!<\/a>)/g ,'<a class="hash_link" data-name="$1" href="#">#$1</a>')
    $(this.editor).html(parsedText);
  }

  this.parseSmartTags = function() {
    var initText = $(this.editor).html()
    
    var parsedText = initText.replace(/\$(\w+)\b(?!<\/a>)/g, function (match, smartTag) {
      var newLink = $("<a />", {
          href : "#",
          class : 'smartTag',
          'data-name': smartTag,
          'data-created-at': new Date().getTime(),
          text : '$'+smartTag
      })
     
      if (smartTag == 'completed') {
        newLink.addClass('completed bg-success')
      } else if (smartTag == 'todo') {
        newLink.addClass('todo bg-warning')
      } else if (smartTag == 'journal') {
        newLink.addClass('journal bg-info')
      } else {

      }
      return newLink.prop('outerHTML');
    });
    
    $(this.editor).html(parsedText);
  }

  this.parseNotebookTags = function() {
    var initText = $(this.editor).html()
  
    var parsedText = initText.replace(/\ @(\w+)\b(?!<\/a>)/g, function (match, notebook) {
      var dataId = $('#notebooks  .notebook_link:contains("'+notebook+'")').data('id');
      var newLink = $("<a />", {
          href : "#",
          class : 'internal_notebook_link',
          'data-name': notebook,
          'data-id': dataId,
          text : '@'+notebook
      })
      return newLink.prop('outerHTML');
    });
    $(this.editor).html(parsedText);
  }
  
  this.extractTags = function(class_name, type) {
    var tagMap = {}
    $(this.editor).find('a.'+class_name).each(function(){
      var name = $(this).data('name')
      if (tagMap[name]) {
        tagMap[name] = tagMap[name]+1
      } else {
        tagMap[name] = 1
      }
    })

    var tagMapSorted = {};
    Object.keys(tagMap).sort().forEach(function(key) {
      tagMapSorted[key] = tagMap[key];
    });    

    $.each(tagMapSorted, function( name, count ) {
      var newLink = $("<a />", {
          'data-name': name,
          href : "#",
          text : type+name+"("+count+")",
          class: 'filter_link'
      });

      $('#allTags').append(newLink).append('<br/>')
    });
  }
  
  this.extractCurrentSprintTags = function() {
    var tagMap = {'current_sprint':0, '$todo':0, '#task':0, '$completed':0,}
    
    $(this.editor).find('li').each(function(){
      var li_text = $(this).clone().children('ul').remove().end().text();

      if (li_text.includes('#current_sprint')) {
        tagMap['current_sprint']++
        if (li_text.includes('$todo')) {
          tagMap['$todo']++
        }
        if (li_text.includes('#task')) {
          tagMap['#task']++
        }  
        if (li_text.includes('$completed')) {
          tagMap['$completed']++
        }
      }
    })
    var currentSprint = $("<a />", {
        'data-name': 'current_sprint',
        href : "#",
        text : "#current_sprint ("+tagMap['current_sprint']+")",
        class: 'bookmark_link'
    });

    $('#sprints').append(currentSprint).append('<br/>')    
    delete tagMap['current_sprint']
    
    $.each(tagMap, function( name, count ) {
      var type = name[0];
      var newLink = $("<a />", {
          'data-name': name.substring(1, name.length),
          href : "#",
          text : name+"("+count+")",
          class: 'sub_bookmark_link'
      });

      $('#sprints').append(newLink).append('<br/>')
    });
    $('#sprints').append('<br/>')
  }
  
  this.extractSprintTags = function() {
    var tagMap = {}
    $(this.editor).find('a.hash_link').each(function(){
      var name = $(this).data('name')
      if (name.startsWith('sprint')) {
        if (tagMap[name]) {
          tagMap[name] = tagMap[name]+1
        } else {
          tagMap[name] = 1
        }
      }
    })
    
    var tagMapSorted = {};
    Object.keys(tagMap).sort().forEach(function(key) {
      tagMapSorted[key] = tagMap[key];
    });

    $.each(tagMapSorted, function( name, count ) {
      var number = name[name.length-1];
      var singleName = name.substring(0, name.length - 1);
      var newLink = $("<a />", {
          'data-name': name,
          href : "#",
          text : "#"+singleName+" "+number+" ("+count+")",
          class: 'bookmark_link'
      });

      $('#sprints').append(newLink).append('<br/>')
    });
  }
  
  this.moveToSprint = function(sprintNumber) {
    $(this.editor).find('a.hash_link').each(function(){
      var name = $(this).data('name')
      if (name =='current_sprint') { //remove old current_sprint
        $(this).remove();
      }
      if (name == 'sprint'+sprintNumber) { //append current sprint
        $(this).after(' <a class="hash_link" data-name="current_sprint" href="#">#current_sprint</a>')
      }
    })
  }
  
  this.getTagAndParents = function(hashtags) {
    var self = this
    var hashtags = hashtags.replace(/  +/g, ' ').replace(/\$/g, '\\$').split(' ')
    hashtags = hashtags.filter(function(h){ return h != "" });
    var fullTags = [];
    $(this.editor).find('li').each(function() {
      var li_text = $(this).clone().children('ul').remove().end().text();
      //filter using OR
      if (new RegExp(hashtags.join("|")).test(li_text)) {
        var fullTag = li_text;
        var lis = $(this).parents('li').each(function() {
          var parentText = $(this).clone().children('ul').remove().end().text();
          fullTag = parentText +' | '+ fullTag
        })
      //  fullTag = fullTag + li_text
        fullTag = fullTag.replace(/\s+ /g, ' ');
        fullTags.push(fullTag);
      }
    })
    return fullTags;
  }
  
}
