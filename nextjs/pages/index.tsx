import styles from '../styles/Home.module.css'
import {useState} from "react";
import {record} from "fp-ts";

import JSZip from "jszip";
import {from} from "rxjs";
import {concatMap} from "rxjs/operators";

function unzip(url: string) {
    fetch(url).then(x => x.blob()).then(buf => {
            console.log(buf.size)
            console.time("unzip total")
            return JSZip.loadAsync(buf)
        }
    ).then(jszip => {
        return from(record.toArray(jszip.files)).pipe(
            concatMap(([x, y]) => {
                return y.async("arraybuffer").finally(() => console.log(x))
            })
        ).toPromise()
    }).then(() => {
        console.timeEnd("unzip total");
    })
}

export default function Home() {
    const [url, urlSet] = useState("/next.js-10.0.8-canary.5.zip");
    return (
        <div className={styles.container}>
            <label htmlFor="basic-url" className="form-label">Zip file URL</label>
            <div className="input-group mb-3">
                <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                       onChange={(e) => urlSet(e.target.value)} value="/next.js-10.0.8-canary.5.zip"/>
                <button type="button" className="btn btn-primary" onClick={() => unzip(url)}>Unzip and measure the
                    time
                </button>
            </div>
        </div>
    )
}