/**
 * 노드를 선택하는 여러가지 메서드
 */

// document.getElementById
document.getElementById('example_id').style.color = 'red';

// document.getElementsByClassName - 색상 변경
document.getElementsByClassName('example_class')[0].style.color = 'blue';
document.getElementsByClassName('example_class')[1].style.color = 'purple';

// document.getElementsByClassName - 속성 추가
document.getElementsByClassName('example_class')[1].setAttribute('data-id', 'test_data');

// document.getElementsByTagName - 스타일, 속성, 클래스 추가
document.getElementsByTagName('p')[0].style.backgroundColor = 'lightgrey';
document.getElementsByTagName('p')[1].setAttribute('data-id', 'test-color');
document.getElementsByTagName('p')[1].classList.add('test-color');

// document.querySelector - 속성 값 제거
document.querySelector('.test_class').removeAttribute('type');
document.querySelector('.test_class').setAttribute('id', 'data-id');

// document.querySelectorAll - 속성의 값을 가져와서 조건에 맞는 배열을 구하기
// document.querySelectorAll('[data-id="test"]').map(($element) => {
//   $element.classList.add('test');
// });
[...document.querySelectorAll('[data-id="test"]')].map(($element, index) => {
  if (0 === index) {
    $element.removeAttribute('data-id');
    $element.setAttribute('data-query', 'test');
    return $element;
  }
});
document.querySelectorAll('[data-id="test"]')[1].setAttribute('data-query', 'test');

/**
 * 노드를 생성하고 조작하는 메서드
 */
// document.createElement - span 요소 생성
const $spanTag = document.createElement('span');
$spanTag.classList.add('color-purple');
$spanTag.innerText = '안녕하세요.';
document.querySelector('.node_manipulation .create_element').append($spanTag);

// appendChild - div 요소 생성 해서 appendChild
const $divTag = document.createElement('div');
$divTag.innerHTML = '<span class="color-purple">네, 안녕하세요.</span>';
document.querySelector('.appendchild').appendChild($divTag);

// removeChild - 자식 노드를 삭제
const $childTag = document.querySelector('.removechild span');
document.querySelector('.removechild').removeChild($childTag);

// removeAttribute - 속성 제거
document.getElementsByClassName('remove_attribute')[0].removeAttribute('data-id');

// createTextNode - 텍스트 노드 생성
const textNode = document.createTextNode('안녕하십니까?');
const $fragment = document.createDocumentFragment();
$fragment.appendChild(textNode);
document.querySelector('.create_textnode').appendChild($fragment);

// cloneNode - 노드 복사
const $originNode = document.querySelector('.clone_node');
const $copyTag = $originNode.cloneNode(true);
$originNode.appendChild($copyTag);

/**
 * 근처 노드에 접근하는 메서드
 */
// parentNode - 부모 노드 접근하기
const $childChildElement = document.getElementById('child_child');
const $parentElement = $childChildElement.parentElement;
const $parentParentElement = $childChildElement.parentNode.parentNode;
$parentElement.setAttribute('data-traversing', 'true');
$parentParentElement.setAttribute('data-traversing', 'true');

// previousSibling/nextSibling, previousElementSibling/nextElementSibling
// 이전 노드 또는 다음 노드 선택하기
const $current = document.querySelector('.current');
console.warn(`previousSibling : `, $current.previousSibling);
console.warn(`previousElementSibling : `, $current.previousElementSibling);
console.warn(`nextSibling : `, $current.nextSibling);
console.warn(`nextElementSibling : `, $current.nextElementSibling);
$current.previousElementSibling.setAttribute('data-traversing', true);
$current.nextElementSibling.setAttribute('data-traversing', true);

// firstChild/lastChild, firstElementChild/lastElementChild
// 첫번째 노드와 마지막 노드 선택하기
const $first_last = document.querySelector('.first_last');
console.warn(`firstChild : `, $first_last.firstChild);
console.warn(`lastChild : `, $first_last.lastChild);
$first_last.firstElementChild.style.color = 'red';
$first_last.lastElementChild.style.color = 'blue';

/**
 * 텍스트 노드를 조작하는 메서드
 */
const contentsText = `<div>
                        <span style="color: red;">innerText</span>
                      </div>`;
const contentsHTML = `<div>
                        <span style="color: blue;">innerHTML</span>
                      </div>
                      `;
const contentsTextContent = `<div>
                                <span style="color: purple;">textContent</span>
                              </div>`;
document.querySelector('.inner_text div').innerText = contentsText;
document.querySelector('.inner_html div').innerHTML = contentsHTML;
document.querySelector('.text_content div').textContent = contentsTextContent;

/**
 * 요소의 위치와 크기를 알아내는 메서드
 */
// getBoundingClientRect
const $positionWidth = document.querySelector('.position_width');
const positionWidth = $positionWidth.getBoundingClientRect();
console.warn(positionWidth);

// offsetLeft, offsetTop, clientLeft, clientTop
const $jsPosition = $positionWidth.querySelector('.js-position');
const $temp = document.createElement('div');
$temp.innerHTML = `<div>
                      ${`$jsPosition.offsetLeft: ${$jsPosition.offsetLeft},
                      $jsPosition.offsetTop: ${$jsPosition.offsetTop}`}
                    </div>
                    <div>
                      ${`$jsPosition.clientLeft: ${$jsPosition.clientLeft},
                      $jsPosition.clientTop: ${$jsPosition.clientTop}`}
                    </div>`;
$jsPosition.appendChild($temp);

// offsetWidth, offsetHeight, clientWidth, clientHeight
const $jsSize = $positionWidth.querySelector('.js-size');
const $temp2 = document.createElement('div');
$temp2.innerHTML = `<div>
                      ${`$jsSize.offsetWidth: ${$jsSize.offsetWidth},
                      $jsSize.offsetHeight: ${$jsSize.offsetHeight}`}
                    </div>
                    <div>
                      ${`$jsSize.clientWidth: ${$jsSize.clientWidth},
                      $jsSize.clientHeight: ${$jsSize.clientHeight}`}
                    </div>`;
$jsSize.appendChild($temp2);
