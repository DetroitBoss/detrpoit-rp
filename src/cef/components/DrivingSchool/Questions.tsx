import React, {Component} from 'react';

import images from './imgs/*.jpg'
import art from './imgs/autoschool-art.png';

interface QuestionsProps {
  list: any[];
  num: number;
  confirm(ans: number, callback: Function): void;
}
interface QuestionsState {
  ans: number;
  isNew: boolean;
}

class Questions extends Component<QuestionsProps, QuestionsState> {
  constructor(props: QuestionsProps) {
    super(props);

    this.state = {
      ans: null,
      isNew: false,
    };
  }

  ansClick = (ans: number) => {
    this.setState({ ans, isNew: false });
  }

  render() {
    const i = this.props.num - 1;
    const list = this.props.list;
    return (
      <div className="autoschool_question">
          <div style={{position:'relative',height: '85vh', width:'43.5vh'}}><img style={{position:'absolute', bottom: '-7.5vh', marginLeft:'5vh'}} src={art}/></div>
          <div className="autoschool_questions">
            <h5 style={{fontWeight: 800}}>Вопрос {i + 1}/{list.length}</h5>
            <h5 style={{fontSize: '1.8vh'}}>{list[i].text}</h5>
            <div style={{marginBottom:'2vh',borderRadius: '6px', maxHeight:'18vh', width:'50vh', overflow: 'hidden', display:'flex', justifyContent:'center', alignItems:'flex-start'}} >
              {list[i].img ? (
                    <img src={images[list[i].img]} />
                  ) : (
                      <img src={images['question']} alt="" />
              )}
            </div>
            {list[i].ans.map( (data:string, idx:number) => {
              return <div key={idx} onClick={() => this.ansClick( idx+1 ) } 
                          className={`autoschool_list${ this.state.ans == idx+1 ? " alist_actv":""}`}>{data}</div>;
            })}
            <div style={{marginTop:'3vh'}} className="autoschool_key" onClick={() =>
                  this.props.confirm(this.state.ans, () => this.setState({ isNew: true, ans: null }) )
                }>{i + 1 != list.length ? 'Далее' : 'Завершить'}</div>
          </div>
      </div>
    )
  }
}

export default Questions;
