import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

class SimpleTable extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            node_address:"",
            version_commit:"",
            version_semanitc:"",
            runtime_uptime:"",
            block_height:"",
            num_keys:"",
            eth_lastBlock:"",
            eth_nodeSync:"",
            eth_node_txRpt:"",
            bcst_sendFail:"",
            failed_commitBlock:"",
            failed_validateBlock:"",
            gossip_activeInc:"",
            gossip_listeningTcpErr:"",
            gossip_listeningTcpScc:"",
            gossip_transportErr:"",
            gossip_outConnActive:"",
            gossip_keepAlive:"",
            gossip_sendErr:"",
            gossip_sendQueueErr:"",	
            metrics_interval:undefined
        }
    }

    getMetrics() {
        fetch("http://35.183.240.87/vchains/1100000/metrics", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data["Node.Address"])
            this.setState({
                node_address:data["Node.Address"].Value,
                version_commit:data["Version.Commit"].Value,
                version_semanitc:data["Version.Semantic"].Value,
                runtime_uptime:data["Runtime.Uptime.Seconds"].Value,
                block_height:data["BlockStorage.BlockHeight"].Value,
                num_keys:data["StateStoragePersistence.TotalNumberOfKeys.Count"].Value,
                eth_lastBlock:data["Ethereum.Node.LastBlock"].Value,
                eth_nodeSync:data["Ethereum.Node.Sync.Status"].Value,
                eth_node_txRpt:data["Ethereum.Node.TransactionReceipts.Status"].Value,
                bcst_sendFail:data["BlockSync.CollectingAvailabilityResponsesState.BroadcastSendFailure.Count"].Value,
                failed_commitBlock:data["BlockSync.ProcessingBlocksState.FailedToCommitBlocks.Count"].Value,
                failed_validateBlock:data["BlockSync.ProcessingBlocksState.FailedToValidateBlocks.Count"].Value,
                gossip_activeInc:data["Gossip.IncomingConnection.Active.Count"].Value,
                gossip_listeningTcpErr:data["Gossip.IncomingConnection.ListeningOnTCPPortErrors.Count"].Value,
                gossip_listeningTcpScc:data["Gossip.IncomingConnection.ListeningOnTCPPortSuccess.Count"].Value,
                gossip_transportErr:data["Gossip.IncomingConnection.TransportErrors.Count"].Value,
                gossip_outConnActive:data["Gossip.OutgoingConnection.Active.Count"].Value,
                gossip_keepAlive:data["Gossip.OutgoingConnection.KeepaliveErrors.Count"].Value,
                gossip_sendErr:data["Gossip.OutgoingConnection.SendErrors.Count"].Value,
                gossip_sendQueueErr:data["Gossip.OutgoingConnection.SendQueueErrors.Count"].Value	
            });
            console.log(this.state.metrics)
        })
    }

    componentDidMount() {
        this.getMetrics()
        let metrics_interval = setInterval(this.getMetrics.bind(this), 20000);
        this.setState({
            metrics_interval:metrics_interval,
        });
    }

    render() {
        const classes = makeStyles(theme => ({
            root: {
                width: '100%',
                marginTop: theme.spacing(3),
                overflowX: 'auto',
            },
            table: {
                minWidth: 650,
            },
        }));

        return (
            <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Metric Name</TableCell>
                        <TableCell align="right">Data</TableCell>
                        <TableCell align="right">Fail Condition</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">Node.Address</TableCell>
                        <TableCell align="right">{this.state.node_address}</TableCell>
                        <TableCell align="right">Not Equal To 8a44e9c662dcf0677d529ef3b000f29a8f741b62</TableCell>
                        <TableCell align="right">{this.state.node_address === "8a44e9c662dcf0677d529ef3b000f29a8f741b62" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Version.Commit</TableCell>
                        <TableCell align="right">{this.state.version_commit}</TableCell>
                        <TableCell align="right">Not Equal To 8a44e9c662dcf0677d529ef3b000f29a8f741b62</TableCell>
                        <TableCell align="right">{this.state.version_commit === "8a44e9c662dcf0677d529ef3b000f29a8f741b62" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Version.Semantic</TableCell>
                        <TableCell align="right">{this.state.version_semanitc}</TableCell>
                        <TableCell align="right">Not Equal To v1.0.6</TableCell>
                        <TableCell align="right">{this.state.version_semanitc === "v1.0.6" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Runtime.Uptime.Seconds</TableCell>
                        <TableCell align="right">{this.state.runtime_uptime}</TableCell>
                        <TableCell align="right">Hasn't increased by at least between 55 to 65 sec every 1 min</TableCell>
                        <TableCell align="right">{this.state.node_address === "8a44e9c662dcf0677d529ef3b000f29a8f741b62" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockStorage.BlockHeight</TableCell>
                        <TableCell align="right">{this.state.block_height}</TableCell>
                        <TableCell align="right">Hasn't increased by at least 1 every 1 min</TableCell>
                        <TableCell align="right">{this.state.node_address === "8a44e9c662dcf0677d529ef3b000f29a8f741b62" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">StateStoragePersistence.TotalNumberOfKeys.Count</TableCell>
                        <TableCell align="right">{this.state.num_keys}</TableCell>
                        <TableCell align="right">Can't decrease &lt; previous value</TableCell>
                        <TableCell align="right">{this.state.node_address === "8a44e9c662dcf0677d529ef3b000f29a8f741b62" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Ethereum.Node.LastBlock</TableCell>
                        <TableCell align="right">{this.state.eth_lastBlock}</TableCell>
                        <TableCell align="right">Hasn't increased by at least 1 every 1 min</TableCell>
                        <TableCell align="right">{this.state.node_address === "8a44e9c662dcf0677d529ef3b000f29a8f741b62" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Ethereum.Node.Sync.Status</TableCell>
                        <TableCell align="right">{this.state.eth_nodeSync}</TableCell>
                        <TableCell align="right">Not "success"</TableCell>
                        <TableCell align="right">{this.state.eth_nodeSync === "success" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Ethereum.Node.TransactionReceipts.Status</TableCell>
                        <TableCell align="right">{this.state.eth_node_txRpt}</TableCell>
                        <TableCell align="right">Not "success"</TableCell>
                        <TableCell align="right">{this.state.eth_node_txRpt === "success" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockSync.CollectingAvailabilityResponsesState.BroadcastSendFailure.Count</TableCell>
                        <TableCell align="right">{this.state.bcst_sendFail}</TableCell>
                        <TableCell align="right">Above 12</TableCell>
                        <TableCell align="right">{this.state.bcst_sendFail <= 12 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockSync.ProcessingBlocksState.FailedToCommitBlocks.Count</TableCell>
                        <TableCell align="right">{this.state.failed_commitBlock}</TableCell>
                        <TableCell align="right">Above 12</TableCell>
                        <TableCell align="right">{this.state.failed_commitBlock <= 12 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockSync.ProcessingBlocksState.FailedToValidateBlocks.Count</TableCell>
                        <TableCell align="right">{this.state.failed_validateBlock}</TableCell>
                        <TableCell align="right">Above 12</TableCell>
                        <TableCell align="right">{this.state.failed_validateBlock <= 12 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.Active.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_activeInc}</TableCell>
                        <TableCell align="right">Above 50</TableCell>
                        <TableCell align="right">{this.state.gossip_activeInc <= 50 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.ListeningOnTCPPortErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpErr}</TableCell>
                        <TableCell align="right">Above 100</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpErr <= 50 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.ListeningOnTCPPortSuccess.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpScc}</TableCell>
                        <TableCell align="right">Above 50</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpScc <= 50 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.TransportErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_transportErr}</TableCell>
                        <TableCell align="right">Above 100</TableCell>
                        <TableCell align="right">{this.state.gossip_transportErr <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.Active.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_outConnActive}</TableCell>
                        <TableCell align="right">Above 100</TableCell>
                        <TableCell align="right">{this.state.gossip_outConnActive <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.KeepaliveErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_keepAlive}</TableCell>
                        <TableCell align="right">Above 100</TableCell>
                        <TableCell align="right">{this.state.gossip_keepAlive <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.SendErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_sendErr}</TableCell>
                        <TableCell align="right">Above 100</TableCell>
                        <TableCell align="right">{this.state.gossip_sendErr <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.SendQueueErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_sendQueueErr}</TableCell>
                        <TableCell align="right">Above 100</TableCell>
                        <TableCell align="right">{this.state.gossip_sendQueueErr <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default SimpleTable;