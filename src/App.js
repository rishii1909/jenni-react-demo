import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import "./App.css"
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import Delta from'quill-delta';

import ReconnectingWebSocket from 'reconnecting-websocket';
import QuillCursors from 'quill-cursors';

ReactQuill.Quill.register('modules/cursors', QuillCursors);


var ws = new ReconnectingWebSocket("ws://jenni-demo-server.herokuapp.com");

var quill_modules = {
  cursors : true,
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

var quill_formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

function App() {

  let uid = Math.random().toString(36).substr(2,9);


  const [document, setDocument] = useState({ops : []});
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to server...");

  const send_ws = (action_type, data) => {
    ws.send(JSON.stringify(
      {
        action : action_type,
        data : data,
      }
    ))
  }

  ws.onmessage = function (event) {
    try {
      const response = JSON.parse(event.data);

      if(response.api_call){
        // let editor = quill_ref.current.editor;
        // const cursors = editor.getModule("cursors");
        // let caret;
        switch (response.api_call) {

          case "get_document":
            setDocument(response.data.document);
            break;

          case "update_document":
            // console.log("received update : ", response.data)
            const new_doc = {
              ops : new Delta(document.ops).compose(new Delta(response.data)).ops
            };
            setDocument(new_doc);
            break;

          
          // case "add_caret":
          //   if(!editor) break;
          //   console.log(response)
          //   caret = response.caret;
          //   cursors.createCursor(caret.uid, caret.name, randomColor());
          //   cursors.update();

          // case "update_caret":
          //   if(!editor) break;
          //   caret = response.caret;
            
          //   if(caret.uid !== uid){
          //     console.log(caret.uid, uid);
          //     cursors.moveCursor(caret.uid, caret.range);
          //     cursors.toggleFlag(uid, true);
          //     cursors.update();

          //     // console.log("Updating caret [" + caret.uid + "]");
          //   }

            



        
          default:
            console.log(response)
            break;
        }
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    ws.onopen = (event) => {
      console.log("Websocket connected")
      setLoading(false);
      setLoadingMessage("");
      send_ws("get_document", {
        uid
      });
  
    };
  
    ws.onerror = function (event) {
      setLoadingMessage("Oops, faced an error.. Please check your console for more details.")
      console.log(event)
    }



    // editor.on("selection-change", (range, oldRange, source) => {
    //   send_ws("update_caret", {
    //     uid, range
    //   });
    // })

    // const cursors = editor.getModule('cursors');
    // const caret = cursors.createCursor(uid, "rishi", "pink");
    // cursors.toggleFlag(uid, true);
    // cursors.update();


  }, [])



  
  const handleQuillChanges = (content, delta, source, editor) => {
    if(source !== 'user') return;
    // console.log("Sending for update : ", delta)
    send_ws("update_document", delta);
  }

  const quill_ref = useRef()

  return (
    <div>
      <Segment raised className="main-wrapper">
        {loading && 
          <Dimmer active inverted>
            <Loader size='big' inverted>{loadingMessage}</Loader>
          </Dimmer>
        }
      <ReactQuill 
        ref={quill_ref} 
        theme="snow" 
        className='quill-editor' 
        value={document} 
        onChange={handleQuillChanges} 
        modules={quill_modules}
        formats={quill_formats}
      />
      </Segment>
    </div>
  );
}

export default App;