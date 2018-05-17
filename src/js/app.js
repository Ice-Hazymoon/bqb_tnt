(function(){

    function SpeechRecognition(){
        let tntBtn = document.getElementById('tnt');


        // 显示录音按钮
        document.getElementById('start-tnt').onclick = function(){
            this.parentNode.removeChild(this);
            document.getElementById('tnt').style.display = 'block';
            document.getElementById('recording-instructions').innerText = '已开启 TNT 模式, 仅支持小部分现代浏览器, 请授权网页使用麦克风, 代码在本地环境运行, 不会上传您的任何信息'
        }

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
        let noteContent = '';

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
    SpeechRecognition()

    // 设置日期
    let d = new Date();
    let text = d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日，晴。和昨天一样没吃饭。一直在群里等人带我。  昨天说好今天带我的，现在他们又说今天要援交没有时间带我，还说不仅今天往后11号、12号都不会带我，居然还说以后都不带我了，简直不能忍一定要好好记下来';
    document.getElementById('text').innerText = text;

    // 上传本地图片
    let input = document.getElementById('file');
    input.addEventListener('change', function(e){
        let files = input.files
        if(files.length){
            if(files[0].type.indexOf('gif') != -1){
                alert('暂不支持GIF文件')
            }else{
                let url = blob = URL.createObjectURL(files[0]);
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

    // 居中
    document.getElementById('font-centering').addEventListener('click', function(e){
        let el = this.parentNode.parentNode.querySelector('.main pre');
        ToggleClass(el, 'center')
    }, false)

    // 加粗
    document.getElementById('font-bold').addEventListener('click', function(e){
        let el = this.parentNode.parentNode.querySelector('.main pre');
        ToggleClass(el, 'bold')
    }, false)

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