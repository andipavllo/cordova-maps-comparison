
/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import util from '../../ons/util';
import animit from '../../ons/animit';
import ToastAnimator from './animator';

/**
 * Fall-fade Toast Animator
 */
export default class FallToastAnimator extends ToastAnimator {

  constructor({ timing = 'ease', delay = 0, duration = 0.35 } = {}) {
    super({ timing, delay, duration });
  }

  /**
   * @param {HTMLElement} toast
   * @param {Function} callback
   */
  show(toast, callback) {
    toast = toast._toast;
    this._updatePosition(toast);

    animit.runAll(
      animit(toast)
        .saveStyle()
        .queue({
          transform: `translate3d(0, -100%, 0)`,
          opacity: 0
        })
        .wait(this.delay)
        .queue({
          transform: 'translate3d(0, 0, 0)',
          opacity: 1.0
        }, {
          duration: this.duration,
          timing: this.timing
        })
        .restoreStyle()
        .queue(done => {
          callback && callback();
          done();
        })
      );
  }

  /**
   * @param {HTMLElement} toast
   * @param {Function} callback
   */
  hide(toast, callback) {
    toast = toast._toast;
    this._updatePosition(toast);

    animit.runAll(
      animit(toast)
        .saveStyle()
        .queue({
          transform: 'translate3d(0, 0, 0)',
          opacity: 1.0
        })
        .wait(this.delay)
        .queue({
          transform: `translate3d(0, -100%, 0)`,
          opacity: 0
        }, {
          duration: this.duration,
          timing: this.timing
        })
        .restoreStyle()
        .queue(done => {
          this._updatePosition(toast, true);
          callback && callback();
          done();
        })
    );
  }

  _updatePosition(toast, cleanUp) {
    if (parseInt(toast.style.top, 10) !== 0) {
      toast.style.top = 0;
      toast.style.bottom = 'initial';
    }
  }
}
