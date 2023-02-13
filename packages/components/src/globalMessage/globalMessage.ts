import { message } from 'antd';

/**
 * 1. 信息队列
 *    接收到的信息 先判断队列中是否有相同的信息，有的话跳过，没有进入对应的队列，
 *    进入队列是没有时延的，执行需要一定的时延保证对重复数据的处理
 * 2. 轮询弹出提示
 *    当队列中有信息的情况下弹出提示，继续轮训，直到所有消息清空
 *
 */

type TypeEnum = 'warn' | 'success' | 'error';

type MessageItem = { type: TypeEnum; message: string; time: number };

const exec = (arr: MessageItem[]) => {
  arr.forEach(item => {
    message[item.type](item.message);
  });
};

const split = (arr: MessageItem[] = [], judge: (item: MessageItem) => boolean) => {
  const ready = [] as MessageItem[];
  const leaved = [] as MessageItem[];

  arr.forEach(item => {
    if (judge(item)) {
      ready.push(item);
    } else {
      leaved.push(item);
    }
  });

  return [ready, leaved];
};

const TIME_DURATION = 300;

class GlobalMessage {
  public messageList: MessageItem[];

  public pollIndex: number | undefined;

  public duration: number;

  constructor(duration: number) {
    this.messageList = [];
    this.pollIndex = undefined;
    this.duration = duration;
  }

  setPoll(func: () => void) {
    // 不使用 window 的话 pollIndex 定义 number 类型失败
    this.pollIndex = window.setInterval(func.bind(this), this.duration);
  }

  clearPoll() {
    window.clearInterval(this.pollIndex);
    this.pollIndex = undefined;
  }

  warn(message: string) {
    this.addMessage('warn', message);
  }

  success(message: string) {
    this.addMessage('success', message);
  }

  error(message: string) {
    this.addMessage('error', message);
  }

  addMessage(type: TypeEnum, message: string) {
    // 相同的 item 不再进入队列
    if (!this.messageList.some(item => item.message === message && item.type === type)) {
      this.messageList.push({ type, message, time: Date.now() });
    }

    // 定时任务不存在时，执行新的定时任务
    if (!this.pollIndex) {
      this.setPoll(this.addMessageCallback);
    }
  }

  addMessageCallback() {
    // 查找在执行期间的内容进行执行
    const now = Date.now();
    const [ready, leaved] = split(this.messageList, item => {
      return now - item.time >= this.duration;
    });
    this.messageList = leaved;

    if (!leaved.length) {
      this.clearPoll();
    }
    exec(ready);
  }
}

const globalMessage = new GlobalMessage(TIME_DURATION);

export default globalMessage;
