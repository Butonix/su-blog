import React,{useRef} from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import RawTool from '@editorjs/raw';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';
import InlineCode from '@editorjs/inline-code';
import Delimiter from "@editorjs/delimiter";
import './markdown.css';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import SavePosterModal from '../../lib/SavePosterModal';
import {posterOutputData} from '../../actions/posts';
import Head from '../../components/header/Header';
import styled from 'styled-components';

const Canvas = styled.div`
  text-align:center;
`



const MarkdownEditorjs = ({}) => {

  const modifyData = useSelector(state => state.posterModify)
  const dispatch = useDispatch();
  const data= useRef('');
  const editor = new EditorJS({ 
    holderId: 'markdownEditor', 
    placeholder: '여기에 작성하세요!',
    tools: {
      image: {
        class: ImageTool,
        config: {
          uploader: {
            /**
             * Upload file to the server and return an uploaded image data
             * @param {File} file - file selected from the device or pasted by drag-n-drop
             * @return {Promise.<{success, file: {url}}>}
             */
            uploadByFile(file){
              // your own uploading logic here
              const formdata = new FormData();
              formdata.append('image', file)
              return axios.post('/postting/fetchFile', formdata)
                .then((res) => {
                  console.log(res.data)
                return {
                  success: 1,
                  file: {
                    url: `img/${res.data}` ,
                    // any other image data you want to store, such as width, height, color, extension, etc
                  }
                };
              });
            },
            uploadByUrl(url){
              // your ajax request for uploading
              return axios.post('/postting/fetchUrl', {url}).then((res) => {
                console.log(res.data);
                return {
                  success: 1,
                  file: {
                    url: res.data,
                    // any other image data you want to store, such as width, height, color, extension, etc
                  }
                }
              })
            }
          }
        }
      },
      //image: SimpleImage,
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+M',
      },
      delimiter: Delimiter,
      checklist :{
        class: Checklist,
        inlineToolbar: true,
      },
      raw: RawTool,
      embed: {
        class: Embed,
        inlineToolbar:true,
        config: {
          services: {
            youtube: true,
            coub: true,
          }
        }
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        },
        shortcut: 'CMD+SHIFT+O',
      },
      header: {
        class: Header, 
        inlineToolbar: ['link'], 
        config: {
          placeholder: "Enter a header"
        },
        type: {
          text: "hi",
          level:2,
        }
      }, 
      list: { 
        class: List, 
        inlineToolbar: true, 
      }  
  },
   data: modifyData.posterModifyData.content,
  onReady: () => {
   var elements = document.querySelectorAll('.codex-editor');
    if(elements[1]) elements[1].style.display="none";
 },
  onChange: () => {
    editor.save().then((outputData) => {
      data.current=outputData;
      
      //setOutput(outputData);
      //const userId = result.id;
      //const nick = result.nick;
      //console.log('userid:',userId);
      //axios.post('/post/upload',
      //{
      //  outputData,
      //  userId,       
      //  nick,
      //})
      //.then((res) => {
      //  alert('저장 완료')
      //  console.log(res.data);
      //}).catch((error) => {
      //  console.log(error.response)
      //})
      //console.log('Article data: ', outputData)
    }).catch((error) => {
      console.log('Saving failed: ', error.response)
    });
  }
})
const outData = () => {
  if(!data.current && modifyData) {
    dispatch(posterOutputData(modifyData.posterModifyData.content));
  }else {
    dispatch(posterOutputData(data.current));
  }
}

  return (
    <Canvas>
      <Head />
      <h1>Create posters</h1>
      <div id="markdownEditor"></div>
      <SavePosterModal modifydata={modifyData.posterModifyData} posterId={modifyData.posterId} onClick={outData}/>
    </Canvas>
  )
}

export default MarkdownEditorjs;