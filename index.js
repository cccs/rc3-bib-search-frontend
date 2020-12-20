/*!
 * AnderShell - Just a small CSS demo
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import './src/styles.scss';
import {terminal} from './src/terminal.js';

// Banner text
const banner = `
Virtual library of Stuttgart
Chaos search index


Type 'help' for a list of available commands.


`;

// Help text
const helpText = `
Available commands:

help - This output
info - Show some data on the library
list <level> - Show all books on given level
search <query> - Search for books
clear - Clears the display
`;


function booksAsText(json) {
  let result = '';
  json.forEach((item) => {
    result += `${item.title} - level ${item.level}\n`;
  });
  return result.trimEnd();
}


function info() {
  let req = new XMLHttpRequest();
  req.open("GET", `${window.location.href}/api/info`, false);
  req.send();
  if (req.status===200) {
    let data = JSON.parse(req.response);
    return `${data.bookCount} books on ${data.levels} levels`;
  } else {
    return `Unable to get result (${req.status})`;
  }
}


function list() {
  return `Can't list all books!`;
}


function listLevel(level) {
  let req = new XMLHttpRequest();
  req.open("GET", `${window.location.href}/api/list/${level}`, false);
  req.send();
  if (req.status===200) {
    let data = JSON.parse(req.response);
    return booksAsText(data);
  } else {
    return `Unable to get result (${req.status})`;
  }
}


function search() {
  let args = Array.prototype.slice.call(arguments);
  let query = {
    query: args.join(' '),
  }

  let req = new XMLHttpRequest();
  req.open("POST", `${window.location.href}/api/search`, false);
  req.send(query);
  if (req.status===200) {
    let data = JSON.parse(req.response);
    return booksAsText(data);
  } else {
    return `Unable to get result (${req.status})`;
  }
}


///////////////////////////////////////////////////////////////////////////////
// MAIN
///////////////////////////////////////////////////////////////////////////////

const load = () => {
  const t = terminal({
    prompt: () => '> ',
    banner,
    commands: {
      help: () => helpText,
      info: info,
      list: (level) => { return (level ? listLevel(level) : list()) },
      search: search,
      clear: () => t.clear(),
    }
  });
};

document.addEventListener('DOMContentLoaded', load);
