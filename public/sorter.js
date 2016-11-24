var Sorter = function(editorId) {
  this.editor = '#'+editorId;
  
  //current_text: space separated string, by which will filter the elements 
  //tagsToHide: array of tags to hide
  this.filter = function(current_text, tagsToHide) {

    current_text = current_text || ''
    tagsToHide = tagsToHide || []
    var self = this
    var hashtags = current_text.replace(/  +/g, ' ').replace(/\$/g, '\\$').split(' ')
    hashtags = hashtags.filter(function(h){ return h != "" });
    var tagsToHide = tagsToHide.map(function(e) {
                        return e.replace(/\$/g, '\\$');
                     })
    tagsToHide = tagsToHide.filter(function(h){ return h != "" });

    $(this.editor).find('li').hide()
    $(this.editor).find('li').each(function() {
      var li_text = $(this).clone().children('ul').remove().end().html();
      //filter using OR
      if (new RegExp(hashtags.join("|")).test(li_text)) {
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
    //parsedText = this.parseSmartTags(parsedText);
    $(this.editor).html(parsedText);
    //this.extractAllTags();
  }

  this.parseSmartTags = function() {
    var initText = $(this.editor).html()
    
    var parsedText = initText.replace(/\$(\w+)\b(?!<\/a>)/g, function (match, smartTag) {
      var newLink = $("<a />", {
          href : "#",
          class : 'smartTag',
          'data-name': smartTag,
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
}
