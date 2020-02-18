import React, {useEffect,useState ,useRef} from 'react';
import Header from '../components/header/Header';
import styled from 'styled-components';
import VariousBtn from '../components/poster/VariousBtn'
import {posterLoadRequest, posterLoadSuccess} from '../actions/posts';
import {useDispatch, useSelector} from 'react-redux';
import CommentBox from '../components/poster/Comments';
import ToggleDial from '../components/poster/ToggleDial';
import {Icon} from 'semantic-ui-react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import storage from '../lib/storage';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml'; 
import css from 'highlight.js/lib/languages/css'; 
import json from 'highlight.js/lib/languages/json'; 
import java from 'highlight.js/lib/languages/java'; 
import python from 'highlight.js/lib/languages/python'; 
import typescript from 'highlight.js/lib/languages/typescript'; 
import 'highlight.js/styles/atom-one-dark-reasonable.css';
hljs.registerLanguage('html', html); 
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('java', java);
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);



const SubTitleBox = styled.div`
  position:fixed;
  z-index:100;
  top:200px;
  right:0;
  width:20%;
  
    ul {
      margin:0;
      .commentView {
        margin-top:20px;
        font-weight:700;
      }
      li {
        margin-bottom:3px;
        a {
          &:hover {
            color:#008000;
          }
          color:rgba(13,72,50,.55);
          text-decoration:none;
        }
        list-style:none;
        font-size:.95rem;
      }
  }
  
 
`

const PosterContainer= styled.div`
  .posterdiv {
    .row {
      margin-left:0;
      margin-right:0;
    }
    .col-md-8.blog-main {
      
      font-size:1.2rem;
      
      margin:0 auto;
      padding:8%;
      word-break:keep-all;
      #content {
        a {
          color:#008000;
        }
        #Title_postTitle {
          font-size:3rem;
          font-weight:bold;
          margin-bottom:20px;
        }
        #Title_profileImg {
          cursor:pointer;
          display:inline-block;
          width:50px;
          height:50px;
          border-radius:50px;
          margin-right:7px;
          background:url(${props => props.profile_img});
          background-size:cover;
          background-position:center center;
        }
        #Title_author {
          cursor:pointer;
          display:inline-block;
          font-weight:500;
          vertical-align: middle;
          margin-bottom:30px;
          &:hover {
            text-decoration:underline;
          }
        }
        #Title_date {
          display:inline-block;
          vertical-align:middle;
          font-size:1.2rem;
        }
      }
      p {
        word-break:break-all;
        line-height:200%;
        letter-spacing: -1px;
        margin-bottom:2rem;
      }
      li {
        line-height:230%;
      }
      img {
        max-width:100%;
      }
    }
  }
`

const ScrollupBtn = styled.div`
  position:fixed;
  width:50px;
  height:50px;
  border-radius:50px;
  border:2px solid #e9e7e7;
  left:83%
  bottom:120px;
  font-size:3em;
  color:#6c757d;
  transition:.3s;
  &:hover {
    color:rgba(13,72,50,.8);
    border-color:rgba(13,72,50,.5);
  }
  i {
    left: -3%;
    position: relative;
    top: -23%;
  }
`
const ScrolldownBtn = styled.div`
  position:fixed;
  width:50px;
  height:50px;
  border-radius:50px;
  border:2px solid #e9e7e7;
  left:83%
  bottom: 50px;
  font-size:3em;
  color:#6c757d;
  transition:.3s;
  &:hover {
    color:rgba(13,72,50,.8);
    border-color:rgba(13,72,50,.5);
  }
  i {
    left: -3%;
    position: relative;
    top: -20%;
  }
`



const Poster = ({match}) => {
  
  const userInfo = storage.get('loginInfo');

  const dispatch = useDispatch();
  const {isLoadding} = useSelector(state => state.posts);
  const [comments, setComments] = useState({});
  const [modifyData, setModifyData] = useState({});
  const [header, setHeader] = useState([{id:'',text:''}]);
  const title = useRef({title:'', profile_img:'', author:'', date:''});
  const history = useHistory();

      const posterShowRequest = async() => {
        dispatch(posterLoadRequest());
        await axios.get(`/post/${match.params.id}/${match.params.author}`)
        .then((res) => {
          dispatch(posterLoadSuccess());
          if(res.data) {
            const outdata = res.data.content.blocks.map((result)=>{
              return result;
            })
            setModifyData(res.data);
            console.log(outdata);
            console.log(res.data)
            
            title.current.title=res.data.tumnailTitle;
            title.current.profile_img = res.data.user.profile_img;
            title.current.author = res.data.author;
            title.current.date = res.data.createdAt.slice(0,10).replace(/-/, '년 ').replace(/-/,'월 ');
            title.current.categorie = res.data.skills;
            title.current.tags = res.data.hashTags;
        
            jsonData(outdata)};
        })
        await axios.get(`/comment/${match.params.id}`).then((res) =>{
          let array=[]; 
          let array1=[];

          res.data.map((dap) => {!dap.parent && array.push(dap)});
          array1=res.data.filter(dap1 => dap1.parent !== null ).reverse();
          array1.map(dap2 => {
            array.map((dap3,i) => dap2.parent === dap3.id ? array.splice(i+1,0,dap2) : null)})
          setComments(array);
        })
      }
      useEffect(() => {
        posterShowRequest();
      },[]);

      const scrollup = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      const scrolldown = () => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }
      console.log(modifyData.tumnailTitle);
      const jsonData = (json) => {
        let html = `<h1 id="Title_postTitle">${title.current.title}</h1><div id='Title_profileImg'></div><div id="Title_author">${title.current.author}</div>  <p id="Title_date">· ${title.current.date}일</p>`;
        json.forEach(function(block,i) {
          
          switch (block.type) {
            case 'header':
              html += `<h${block.data.level} id='${i+'_'+block.data.text}'>${block.data.text}</h${block.data.level}>`;
              setHeader((prev) => [...prev,{id:i+'_'+block.data.text,text:block.data.text}])
              break;
            case 'paragraph':
              html += `<p>${block.data.text}</p>`;
              break;
            case 'delimiter':
              html += '<hr />';
              break;
            case 'image':
              html += `<img className="img-fluid" src="${block.data.file.url}" alt="" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
              break;
            case 'list':
              if(block.data.style==='ordered') {
                html += '<ol>';
                block.data.items.forEach(function(li) {
                  html += `<li>${li}</li>`;
              })
              html += '</ol>';
            }else { 
              html += '<ul>';
              block.data.items.forEach(function(li) {
                html += `<li>${li}</li>`;
              });
              html += '</ul>';
            }
              break;
            case 'embed':
              html += `<embed src="${block.data.embed}" width="${block.data.width}" height="${block.data.height}"><br /><em>${block.data.caption}</em>`
              break;
            case 'raw':
              
              const highlightedCode = hljs.highlightAuto(block.data.html).value
              html += `<pre><code class="hljs" style="max-height:700px">${highlightedCode}</code></pre>`
              break;

            default:
              console.log('Unknown block type', block.type);
              console.log(block);
              break;
          }
          document.getElementById('content').innerHTML = html;
          document.getElementById('Title_profileImg').onclick=function(){ history.push(`/about/@${title.current.author}`)}
          document.getElementById('Title_author').onclick=function(){ history.push(`/about/@${title.current.author}`)}
        });
      };

      const SubTitle = () => {
        return header ? <SubTitleBox>{<ul>{header.map(
            (title) => {
               return (<li key={title.id}><a href={'#'+title.id}>{title.text}</a></li>)
            }
        )}<li className="commentView"><a href="#commentView">댓글 보기</a></li></ul>}</SubTitleBox> : null
      }
    console.log(title.current.profile_img)
    return (
      <>
        <Header />
        <SubTitle />
        <ToggleDial width={54} left={'18%'} id={match.params.id} author={match.params.author} />
        <ScrollupBtn height={window.innerHeight} onClick={scrollup}><Icon name="angle up"/></ScrollupBtn>
        <ScrolldownBtn height={window.innerHeight} onClick={scrolldown}><Icon name="angle down"/></ScrolldownBtn>
        <PosterContainer profile_img={'img/'+title.current.profile_img}>
          <main role="main" className="posterdiv">
            <div className="row">
              <div className="col-md-8 blog-main">
                <div className="blog-post">
                  <div id="content">
                    ..isLoadding                  
                  </div>
                </div>
                {isLoadding === 'SUCCESS' && (userInfo ? (userInfo.nick === match.params.author || userInfo.nick === ' Operator') : false ) ? 
                  <VariousBtn data={modifyData} posterId={match.params.id} author={match.params.author}/> : ''}
                <CommentBox data={comments} postId={match.params.id}/>
              </div>
            </div>
          </main>
        </PosterContainer>
      </>
    )
}
export default Poster;