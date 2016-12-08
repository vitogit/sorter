var  expect = chai.expect

describe('Sorter', function() {
  before(function() { 
    var editor = $('<div id="editor"> <ul> <li> root <ul> <li>child1 #hash1 #sprint1 open @notebook1 mail@mail.com a.com/@this/hello</li><li> child2 #hash2 #sprint2<ul> <li>grandchild1</li><li>grandchild2 $completed @notebook2</li></ul> </li></ul> </li></ul></div>');
    var allTags = $('<div id="allTags"></div>')
    var sprints = $('<div id="sprints"></div>')
    $('body').append(editor).append(allTags).append(sprints)
    sorter = new Sorter(editor)
  }); 

  it('exists', function() {
    expect(sorter).to.exist
  })

  it('has a editor property ', function() {
    expect(sorter.editor).to.exist
  })

  it('filter by hash', function() {
    expect(visibleRows()).to.be.eq(5)
    sorter.filter('#hash1');
    expect(visibleRows()).to.be.eq(2) //root and li
  })
  
  it('filter by smarttag', function() {
    sorter.filter('$completed');
    expect(visibleRows()).to.be.eq(3) //root and child and grandchild
  }) 
  
  it('filter by 2 hashtags using OR ', function() {
    sorter.filter('#hash1 #hash2');
    expect(visibleRows()).to.be.eq(5) //root and everyone
  }) 

  it('filter by 2 hashtags using AND ', function() {
    sorter.filter('& #hash1 #sprint1', [], 'AND');
    expect(visibleRows()).to.be.eq(2) //root and the first

    sorter.filter('& #sprint1 #hash1', [], 'AND');
    expect(visibleRows()).to.be.eq(2) //root and the first
  })

  it('hide completed and search hashtags', function() {
    sorter.filter('#hash2', ['$completed']);
    expect(visibleRows()).to.be.eq(3) //root, child2 and 1 grandchild (hide one)
  })

  it('parse the hashtags', function() {
    $(sorter.editor).find('li').show()
    sorter.parseHashtags();
    var parsedCount = $('.hash_link').length
    expect(parsedCount).to.be.eq(4) 
  })

  it('parse the smartTags', function() {
    $(sorter.editor).find('li').show()
    sorter.parseSmartTags();
    var parsedCount = $('.smartTag').length
    expect(parsedCount).to.be.eq(1)
  })
  
  it('parse the notebooks links', function() {
    $(sorter.editor).find('li').show()
    sorter.parseNotebookTags();
    var parsedCount = $('.internal_notebook_link').length
    expect(parsedCount).to.be.eq(2)
  })
  
  it('extract all the tags', function() {
    sorter.extractTags('smartTag','$');
    sorter.extractTags('hash_link','#');
    var tagsCount = $('#allTags a').length
    expect(tagsCount).to.be.eq(5) 
  })

  it('extract sprint tags', function() {
    sorter.extractSprintTags();
    var tagsCount = $('#sprints a').length
    expect(tagsCount).to.be.eq(2) 
  })

  it('extract current sprint tags', function() {
    $('#editor').remove()
    $('#sprints').remove()
    var editor = $('<div id="editor"> <ul> <li> root <ul> <li>child1 #task #sprint1 #current_sprint</li><li> child2 $todo #sprint1 #current_sprint <ul> <li>grandchild1 #task </li><li>grandchild2 $completed #sprint1 #current_sprint</li></ul> </li></ul> </li></ul></div>');
    var sprints = $('<div id="sprints"></div>')
    $('body').append(editor).append(sprints)    
    sorter = new Sorter(editor)
        
    sorter.extractCurrentSprintTags();
    var currentSprint = $('#sprints').text()
    expect(currentSprint).to.be.eq('#current_sprint (3)$todo(1)#task(1)$completed(1)') 
    expect(countHashtag('#current_sprint')).to.be.eq(3)
  })

  it('changes the sprint', function() {
    $('#editor').remove()
    $('#sprints').remove()
    var editor = $('<div id="editor"> <ul> <li> root <ul> <li>child1 <a class="hash_link" data-name="task" href="#">#task</a> <a class="hash_link" data-name="sprint1" href="#">#sprint1</a> <a class="hash_link" data-name="current_sprint" href="#">#current_sprint</a></li><li> child2 $todo <a class="hash_link" data-name="sprint1" href="#">#sprint1</a> <a class="hash_link" data-name="current_sprint" href="#">#current_sprint</a> <ul> <li>grandchild1 <a class="hash_link" data-name="sprint2" href="#">#sprint2</a> <a class="hash_link" data-name="task" href="#">#task</a> </li><li>grandchild2 $completed <a class="hash_link" data-name="sprint1" href="#">#sprint1</a> <a class="hash_link" data-name="current_sprint" href="#">#current_sprint</a></li></ul> </li></ul> </li></ul></div>');
    var sprints = $('<div id="sprints"></div>')
    $('body').append(editor).append(sprints)    
    sorter = new Sorter(editor)    
    
    expect(countHashtag('#sprint1')).to.be.eq(3) 
    expect(countHashtag('#sprint2')).to.be.eq(1) 
    sorter.moveToSprint(2); //change the current sprint to 2 from 1
    expect(countHashtag('#sprint1')).to.be.eq(3) 
    expect(countHashtag('#sprint2')).to.be.eq(1) 
    expect(countHashtag('#current_sprint')).to.be.eq(1) 
  })

  xit('get hashtags and parents in text [currently not used]', function() {
    $('#editor').remove()
    var editor = $('<div id="editor"> <ul> <li> root <ul> <li>child1 #task</li><li> child2 #hash2 <ul> <li>grandchild1 #task</li><li>grandchild2 $completed</li></ul> </li></ul> </li></ul></div>');
    $('body').append(editor) 
    sorter = new Sorter(editor)
    
    var tags = sorter.getTagAndParents('#task')
  
    expect(tags.length).to.be.eq(2) 
    expect(tags[0]).to.be.eq(' root | child1 #task') 
    expect(tags[1]).to.be.eq(' root | child2 #hash2 | grandchild1 #task') 
  })

  
  function visibleRows() {
   return $(sorter.editor).find('li').filter(function() {
            return $(this).css('display') !== 'none';
          }).length;
  }

  function countHashtag(hashtag) {
   return $(sorter.editor).find('li').filter(function() {
      var li_text = $(this).clone().children('ul').remove().end().html();
      return li_text.includes(hashtag);
          }).length;
  }
  
})
