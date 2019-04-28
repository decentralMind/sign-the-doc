import React from 'react';
import moment from 'moment';

export const RenderDocInfo = (docData) => {

    return (
        <div>
            <table>
                <tbody>
                    {docData.signature ? (
                        Object.keys(docData).map((key, index) => {
                            const loadData = docData[key];
                            if (key === "whoSigned" && loadData.length > 1) {
                                return (
                                    <tr key={index.toString()}>
                                        <td>{key}</td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    {loadData.map((signer, index) => {
                                                        return (
                                                            <tr key={"ws" + index.toString()}>
                                                                <td>{signer}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                );
                            } else if (key === "whoSigned" && loadData.length === 0) {
                                return (
                                    <tr key={index.toString()}>
                                        <td> {key} </td>
                                        <td>No one has signed yet.</td>
                                    </tr>
                                );
                            }

                            if (key === "authorisedSigners" && loadData.length > 1) {
                                return (
                                    <tr key={index.toString()}>
                                        <td>{key}</td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    {loadData.map((signer, index) => {
                                                        return (
                                                            <tr key={"as" + index.toString()}>
                                                                <td>{signer}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                );
                            } else if (key === "authorisedSigners" && loadData.length === 0) {
                                return (
                                    <tr key={index.toString()}>
                                        <td>{key}</td>
                                        <td>Any one can sign(Open Document)</td>
                                    </tr>
                                )
                            }

                            if (key === 'expiryDate' || key === 'creationDate') {
                                const loadDate = docData[key]
                                let convertDate;

                                /*
                                If expiry date is not provided or user decided to deploy document 
                                without expiry date, default value 0 is set, which will open the document
                                for signing indefinitely.
                                 */
                                if (key === 'expiryDate' && loadDate.toNumber() === 0) {
                                    convertDate = `Expiry Date not included.`
                                } else {
                                    convertDate = moment.unix(loadDate.toNumber()).format("dddd, MMMM Do YYYY, h:mm:ss a");
                                }
                                return (
                                    <tr key={index.toString()}>
                                        <td >{key}</td>
                                        <td>{convertDate}</td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={index.toString()}>
                                    <td >{key}</td>
                                    <td>{docData[key]}</td>
                                </tr>
                            );
                        })
                    ) : (
                            null
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

