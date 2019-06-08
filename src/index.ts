if ((<any>module).hot) {
    console.clear(); //  自动更新之前先清空下控制台, 不然旧纪录会在控制台上, 很乱(这样控制台上就显示最新的info了.)
    (<any>module).hot.accept();
}
import './styles/canvas_thanos.sass';
import './create_canvas';