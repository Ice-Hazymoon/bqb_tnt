(function(){
    let pre = document.getElementById('text')

    function SpeechRecognition(){
        let tntBtn = document.getElementById('tnt');

        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();
        } catch (e) {
            console.error(e);
            tntBtn.parentNode.removeChild(tntBtn);
            alert('您的浏览器暂不支持语音识别')
        }

        let noteTextarea = document.getElementById('text');
        let instructions = document.getElementById('recording-instructions');
        let noteContent = noteTextarea.innerHTML;

        recognition.continuous = true;

        recognition.onresult = (event)=> {
            let current = event.resultIndex;

            // 获取识别后的内容
            let transcript = event.results[current][0].transcript;

            // 解决安卓设备的bug
            let mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

            if (!mobileRepeatBug) {
                noteContent += transcript;
                noteTextarea.innerText = noteContent;
            }
        };

        recognition.onstart = (e)=> {
            instructions.innerText = '正在识别, 请讲话';
        }

        recognition.onerror = (event)=> {
            if (event.error == 'no-speech') {
                instructions.innerText = '未检测到语音，请再试一次';
            };
        }

        document.getElementById('start-recording').addEventListener('click', e=>{
            console.log('开始录音');
            recognition.start();
            if (noteContent.length) {
                noteContent += ' ';
            }
        })

        document.getElementById('stop-recording').addEventListener('click', e=>{
            console.log('录音停止');
            recognition.stop();
            instructions.innerText = '语音识别暂停';
        })
    }

    // 设置日期
    let d = new Date();
    let text = d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日，晴。和昨天一样没吃饭。一直在群里等人带我。  昨天说好今天带我的，现在他们又说今天要援交没有时间带我，还说不仅今天往后'+(d.getDate()+1)+'号、'+(d.getDate()+2)+'号都不会带我，居然还说以后都不带我了，简直不能忍一定要好好记下来';
    document.getElementById('text').innerText = text;

    // 上传本地图片
    let input = document.getElementById('file');
    input.addEventListener('change', function(e){
        let files = input.files
        if(files.length){
            if(files[0].type.indexOf('gif') != -1){
                alert('暂不支持GIF文件')
            }else{
                getBase64(files[0]).then(
                    data => {
                        document.getElementById('uploadImg').src = data;
                    }
                ).catch(err=>{
                    alert('上传失败, 请尝试更换浏览器后重试')
                });
            }
        }
    }, false)

    // 切换图片
    document.querySelectorAll('.select-img img').forEach((el, index, list)=>{
        el.addEventListener('click', function(e){
            let imgSrc = this.src;
            document.getElementById('uploadImg').src = imgSrc;
        }, false)
    })

    // 文件转base64
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // 切换class
    function ToggleClass(el, classname){
        if(el.classList.contains(classname)){
            el.classList.remove(classname);
        }else{
            el.classList.add(classname);
        }
    }

    // 生成canvas
    function newCanvas(el, callback){
        html2canvas(el, {
            allowTaint: true,
            taintTest: false,
            width: el.offsetWidth,
            height: el.offsetHeight,
            scale: 2
        }).then(canvas=>{
            document.getElementById('canvas').src = canvas.toDataURL("image/png");
            setTimeout(() => {
                window.scrollTo(0,document.body.scrollHeight)
            }, 300);
        }).catch(err=>{
            alert('生成失败, 请尝试更换浏览器后重试'+err)
        });
    }
    
    // 上传图片
    document.getElementById('uploadImg').addEventListener('click', function(e){
        input.click();
    }, false)

    //  开启 TNT 模式
    document.getElementById('start-tnt').onclick = function(){
        SpeechRecognition()
        this.parentNode.removeChild(this);
        document.getElementById('tnt').style.display = 'block';
        document.getElementById('recording-instructions').innerText = '已开启 TNT 模式, 仅支持小部分现代浏览器, 请授权网页使用麦克风, 代码在本地环境运行, 不会上传您的任何信息'
    }

    // 字体样式
    function fontStyle(id, style){
        document.getElementById(id).addEventListener('click', function(e){
            ToggleClass(pre, style);
        }, false)
    }

    // 居中
    fontStyle('font-centering', 'center');
    // 加粗
    fontStyle('font-bold', 'bold');
    // 斜体
    fontStyle('font-italic', 'italic');
    // 字体放大
    document.getElementById('font-enlarge').addEventListener('click', e=>{
        // pre
        let fontSize = parseInt(getComputedStyle(pre)['fontSize']);
        pre.style.fontSize = fontSize+1+'px';
    })
    // 字体缩小
    document.getElementById('font-reduce').addEventListener('click', e=>{
        // pre
        let fontSize = parseInt(getComputedStyle(pre)['fontSize']);
        pre.style.fontSize = fontSize-1+'px';
    })
    // 自定义css样式
    document.getElementById('font-css').addEventListener('click', e=>{
        let text = prompt('(实验性功能) 请输入需要自定义的 css 样式, 格式为 "line-height:1.5;color:red;" 不能少分号!!!');
        if(text && text.trim()){
            let cssText = text.replace(/\s/g, '').match(/[\w\-]+\:.+\;/g);
            let style = document.createElement('style');
            style.innerText = '#text{'+cssText+'}';
            document.body.appendChild(style);
        }
    })

    // 使用方法
    document.getElementById('instructions').addEventListener('click', e=>{
        alert(`- 点击图片可上传本地图片, 也可使用自带模板\n\
- 点击文字可自行编辑\n\
- 可自定义css(实验性功能), 结尾一定要加分号!!\n\
- 开启TNT模式后可录制语音并转换为文字\n\
- TNT 模式仅支持部分浏览器, 推荐使用 Chrome\n\
- 编辑完后点击生成, 在网页最下方生成的图片上长按即可保存\n\
- 文本框内支持粘贴word文档, 代码块, 图片等内容\n\
- 源代码地址: https://github.com/Ice-Hazymoon/bqb_tnt\n\
- 作者博客: https://imiku.me`);
    })

    // 下载
    document.getElementById('download').addEventListener('click', function(e){
        let el = this.parentNode.parentNode.querySelector('.main');
        newCanvas(el, function(url){
            let a = document.createElement('a');
            a.href = url;
            a.download = 'bqb.jpg';
            a.click();
        })
    }, false)
}())