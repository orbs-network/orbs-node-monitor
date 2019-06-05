import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Counter from './UpdateTimer';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import nodeData from '../node.json';

class SimpleTable extends React.Component {
    constructor (props) {
        super (props);
        // Init state values default success
        this.state = {
            org:"",
            ip:"",
            node_address:"",
            version_commit:["0","success"],
            version_semanitc:["0","success"],
            runtime_uptime:[0,"pending"],
            block_height:[0,"pending"],
            num_keys:[0,"pending"],
            eth_lastBlock:[0,"pending"],
            eth_nodeSync:[0,"pending"],
            eth_node_txRpt:[0,"pending"],
            bcst_sendFail:[0,"pending"],
            failed_commitBlock:[0,"pending"],
            failed_validateBlock:[0,"pending"],
            gossip_activeInc:[0,"pending"],
            gossip_listeningTcpErr:[0,"pending"],
            gossip_listeningTcpScc:[0,"pending"],
            gossip_transportErr:[0,"pending"],
            gossip_outConnActive:[0,"pending"],
            gossip_keepAlive:[0,"pending"],
            gossip_sendErr:[0,"pending"],
            gossip_sendQueueErr:[0,"pending"],	
            metrics_interval:undefined,
            veresion_interval:undefined,
            most_recent_commit:"0",
            most_recent_semantic:"0",
            overall:"pending"
        }
    }

    checkVersion() {
        fetch("https://api.github.com/repos/orbs-network/orbs-network-go/tags", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState((prevState)=>({
                version_commit:[prevState.version_commit[0], prevState.version_commit[0] === data[0].commit.sha ? "success" : "failure"],
                version_semanitc:[prevState.version_semanitc[0], prevState.version_semanitc[0] === data[0].name ? "success" : "failure"],
                most_recent_commit:data[0].commit.sha,
                most_recent_semantic:data[0].name,
                runtime_uptime:prevState.runtime_uptime,
                block_height: prevState.block_height,
                eth_lastBlock: prevState.eth_lastBlock
            }))
        })
    }

    getInit(ip) {
        fetch("http://"+ip+"/vchains/1100000/metrics", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState((prevState)=>({
                node_address:data["Node.Address"].Value,
                version_commit:[data["Version.Commit"].Value,prevState.version_commit[1]],
                version_semanitc:[data["Version.Semantic"].Value,prevState.version_semanitc[1]],
                runtime_uptime:[data["Runtime.Uptime.Seconds"].Value, "pending"],
                block_height:[data["BlockStorage.BlockHeight"].Value, "pending"],
                num_keys:[data["StateStoragePersistence.TotalNumberOfKeys.Count"].Value,"pending"],
                eth_lastBlock:[data["Ethereum.Node.LastBlock"].Value, "pending"],
                eth_nodeSync:[data["Ethereum.Node.Sync.Status"].Value, "pending"],
                eth_node_txRpt:[data["Ethereum.Node.TransactionReceipts.Status"].Value,"pending"],
                bcst_sendFail:[data["BlockSync.CollectingAvailabilityResponsesState.BroadcastSendFailure.Count"].Value, "pending"],
                failed_commitBlock:[data["BlockSync.ProcessingBlocksState.FailedToCommitBlocks.Count"].Value, "pending"],
                failed_validateBlock:[data["BlockSync.ProcessingBlocksState.FailedToValidateBlocks.Count"].Value, "pending"],
                gossip_activeInc:[data["Gossip.IncomingConnection.Active.Count"].Value,"pending"],
                gossip_listeningTcpErr:[data["Gossip.IncomingConnection.ListeningOnTCPPortErrors.Count"].Value,"pending"],
                gossip_listeningTcpScc:[data["Gossip.IncomingConnection.ListeningOnTCPPortSuccess.Count"].Value,"pending"],
                gossip_transportErr:[data["Gossip.IncomingConnection.TransportErrors.Count"].Value,"pending"],
                gossip_outConnActive:[data["Gossip.OutgoingConnection.Active.Count"].Value,"pending"],
                gossip_keepAlive:[data["Gossip.OutgoingConnection.KeepaliveErrors.Count"].Value,"pending"],
                gossip_sendErr:[data["Gossip.OutgoingConnection.SendErrors.Count"].Value,"pending"],
                gossip_sendQueueErr:[data["Gossip.OutgoingConnection.SendQueueErrors.Count"].Value,	"pending"]
            }));

            this.checkVersion();
        })
    }

    getMetrics() {
        fetch("http://"+this.state.ip+"/vchains/1100000/metrics", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState((prevState)=>({
                node_address:data["Node.Address"].Value,
                version_commit:[data["Version.Commit"].Value,prevState.version_commit[1]],
                version_semanitc:[data["Version.Semantic"].Value,prevState.version_semanitc[1]],
                runtime_uptime:[data["Runtime.Uptime.Seconds"].Value, data["Runtime.Uptime.Seconds"].Value >= prevState.runtime_uptime[0] + 55  ? "success" : "failure"],
                block_height:[data["BlockStorage.BlockHeight"].Value, data["BlockStorage.BlockHeight"].Value >= prevState.block_height[0] + 1 ? "success" : "failure"],
                num_keys:[data["StateStoragePersistence.TotalNumberOfKeys.Count"].Value,data["StateStoragePersistence.TotalNumberOfKeys.Count"].Value >= prevState.num_keys[0] ? "success" : "failure"],
                eth_lastBlock:[data["Ethereum.Node.LastBlock"].Value,data["Ethereum.Node.LastBlock"].Value >= prevState.eth_lastBlock[0] + 1 ? "success" : "failure"],
                eth_nodeSync:[data["Ethereum.Node.Sync.Status"].Value, data["Ethereum.Node.Sync.Status"].Value === "success" ? "success" : "failure"],
                eth_node_txRpt:[data["Ethereum.Node.TransactionReceipts.Status"].Value, data["Ethereum.Node.TransactionReceipts.Status"].Value === "success" ? "success" : "failure"],
                bcst_sendFail:[data["BlockSync.CollectingAvailabilityResponsesState.BroadcastSendFailure.Count"].Value, data["BlockSync.CollectingAvailabilityResponsesState.BroadcastSendFailure.Count"].Value < 12 ? "success" : "failure"],
                failed_commitBlock:[data["BlockSync.ProcessingBlocksState.FailedToCommitBlocks.Count"].Value, data["BlockSync.ProcessingBlocksState.FailedToCommitBlocks.Count"].Value < 12 ? "success" : "failure"],
                failed_validateBlock:[data["BlockSync.ProcessingBlocksState.FailedToValidateBlocks.Count"].Value, data["BlockSync.ProcessingBlocksState.FailedToValidateBlocks.Count"].Value < 12 ? "success" : "failure"],
                gossip_activeInc:[data["Gossip.IncomingConnection.Active.Count"].Value,data["Gossip.IncomingConnection.Active.Count"].Value < 50 ? "success" : "failure"],
                gossip_listeningTcpErr:[data["Gossip.IncomingConnection.ListeningOnTCPPortErrors.Count"].Value,data["Gossip.IncomingConnection.ListeningOnTCPPortErrors.Count"].Value < 100 ? "success" : "failure"],
                gossip_listeningTcpScc:[data["Gossip.IncomingConnection.ListeningOnTCPPortSuccess.Count"].Value,data["Gossip.IncomingConnection.ListeningOnTCPPortSuccess.Count"].Value < 50 ? "success" : "failure"],
                gossip_transportErr:[data["Gossip.IncomingConnection.TransportErrors.Count"].Value,data["Gossip.IncomingConnection.TransportErrors.Count"].Value < 50 ? "success" : "failure"],
                gossip_outConnActive:[data["Gossip.OutgoingConnection.Active.Count"].Value,data["Gossip.OutgoingConnection.Active.Count"].Value < 100 ? "success" : "failure"],
                gossip_keepAlive:[data["Gossip.OutgoingConnection.KeepaliveErrors.Count"].Value,data["Gossip.OutgoingConnection.KeepaliveErrors.Count"].Value < 100 ? "success" : "failure"],
                gossip_sendErr:[data["Gossip.OutgoingConnection.SendErrors.Count"].Value,data["Gossip.OutgoingConnection.SendErrors.Count"].Value < 100 ? "success" : "failure"],
                gossip_sendQueueErr:[data["Gossip.OutgoingConnection.SendQueueErrors.Count"].Value,	data["Gossip.OutgoingConnection.SendQueueErrors.Count"].Value < 100 ? "success" : "failure"],
                overall:"success"
            }));

            this.checkVersion();

            Object.values(this.state).reduce((success, value) => {
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        if (value[1] === "failure") {
                            this.setState({overall:"failure"})
                            return "success"
                        } else {
                            return "success"
                        }
                    } else {
                        return "success"
                    }
                } else {
                    return "success"
                }
            })
         })
    }

    componentDidMount() {
        this.setState({
            org:nodeData.organization,
            ip:nodeData.ip
        })      
        this.getInit(nodeData.ip)      
        this.checkVersion()
        let metrics_interval = setInterval(this.getMetrics.bind(this), 60000);
        this.setState({
            metrics_interval:metrics_interval,
        })
    }

    render() {
        const classes = makeStyles(theme => ({
            root: {
              width: '100%',
            },
            paper: {
              marginTop: theme.spacing(3),
              width: '100%',
              overflowX: 'auto',
              marginBottom: theme.spacing(2),
            },
            table: {
              minWidth: 650,
            },
          }));

        const theme = createMuiTheme({
            palette: {
              primary: { main: '#11cb5f'  }, // Purple and green play nicely together.
            },
        });
          
        return (
            <div className={classes.root}>
            <ThemeProvider theme={theme}>

            <Paper className={classes.paper}>
            <p id="title"> Orbs Node Monitor <span class="subtitle"> {this.state.org} </span></p>
            <Counter/>
            <Table className={classes.table} size="small">
           
                <TableHead>
                <TableRow>
                    <p class="heading">Overall Health:
                    {this.state.overall !== "pending" ? 

                        this.state.overall === "success" ? <span class="success"> Success </span>: <span class="failure"> Failure</span> :
                        <span class="pending"> Pending </span>
                    }
                    </p>
                    
                </TableRow>
                    <TableRow>
                        <TableCell>Metric Name</TableCell>
                        <TableCell align="right">Data</TableCell>
                        <TableCell align="right">Success Condition</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">Node.Address</TableCell>
                        <TableCell align="right">{this.state.node_address}</TableCell>
                        <TableCell align="right">== 8a44e9c662dcf0677d529ef3b000f29a8f741b60</TableCell>
                        <TableCell align="right">{this.state.node_address === "8a44e9c662dcf0677d529ef3b000f29a8f741b60" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Version.Commit</TableCell>
                        <TableCell align="right">{this.state.version_commit[0]}</TableCell>
                        <TableCell align="right">== {this.state.most_recent_commit}</TableCell>
                        <TableCell align="right">
                            {this.state.version_commit[1] === "success" ? 
                                <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> 
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Version.Semantic</TableCell>
                        <TableCell align="right">{this.state.version_semanitc[0]}</TableCell>
                        <TableCell align="right">== {this.state.most_recent_semantic}</TableCell>
                        <TableCell align="right">{this.state.version_semanitc[1] === "success" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Runtime.Uptime.Seconds</TableCell>
                        <TableCell align="right">{this.state.runtime_uptime[0]}</TableCell>
                        <TableCell align="right">previous data + 55 &lt;= data</TableCell>
                        <TableCell align="right">
                            {this.state.runtime_uptime[1] !== "pending" ? 
                                this.state.runtime_uptime[1] === "success" ? <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> :
                                <Chip color="default" label="pending"/>
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockStorage.BlockHeight</TableCell>
                        <TableCell align="right">{this.state.block_height[0]}</TableCell>
                        <TableCell align="right">&gt; previous data</TableCell>
                        <TableCell align="right">{this.state.block_height[1] !== "pending" ? 
                                this.state.block_height[1] === "success" ? <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> :
                                <Chip color="default" label="pending"/>
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">StateStoragePersistence.TotalNumberOfKeys.Count</TableCell>
                        <TableCell align="right">{this.state.num_keys[0]}</TableCell>
                        <TableCell align="right">&gt;= previous data</TableCell>
                        <TableCell align="right">{this.state.num_keys[1] !== "pending" ? 
                                this.state.num_keys[1] === "success" ? <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> :
                                <Chip color="default" label="pending"/>
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Ethereum.Node.LastBlock</TableCell>
                        <TableCell align="right">{this.state.eth_lastBlock[0]}</TableCell>
                        <TableCell align="right">> previous data</TableCell>
                        <TableCell align="right">{this.state.eth_lastBlock[1] !== "pending" ? 
                                this.state.eth_lastBlock[1] === "success" ? <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> :
                                <Chip color="default" label="pending"/>
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Ethereum.Node.Sync.Status</TableCell>
                        <TableCell align="right">{this.state.eth_nodeSync[0]}</TableCell>
                        <TableCell align="right">== "success"</TableCell>
                        <TableCell align="right">{this.state.eth_nodeSync[0] === "success" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Ethereum.Node.TransactionReceipts.Status</TableCell>
                        <TableCell align="right">{this.state.eth_node_txRpt[0]}</TableCell>
                        <TableCell align="right">== "success"</TableCell>
                        <TableCell align="right">{this.state.eth_node_txRpt[0] === "success" ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockSync.CollectingAvailabilityResponsesState.BroadcastSendFailure.Count</TableCell>
                        <TableCell align="right">{this.state.bcst_sendFail[0]}</TableCell>
                        <TableCell align="right">&lt; 12</TableCell>
                        <TableCell align="right">{this.state.bcst_sendFail[0] <= 12 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockSync.ProcessingBlocksState.FailedToCommitBlocks.Count</TableCell>
                        <TableCell align="right">{this.state.failed_commitBlock[0]}</TableCell>
                        <TableCell align="right">&lt; 12</TableCell>
                        <TableCell align="right">{this.state.failed_commitBlock[0] <= 12 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">BlockSync.ProcessingBlocksState.FailedToValidateBlocks.Count</TableCell>
                        <TableCell align="right">{this.state.failed_validateBlock[0]}</TableCell>
                        <TableCell align="right">&lt; 12</TableCell>
                        <TableCell align="right">{this.state.failed_validateBlock[0] <= 12 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.Active.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_activeInc[0]}</TableCell>
                        <TableCell align="right">&lt; 50</TableCell>
                        <TableCell align="right">{this.state.gossip_activeInc[0] <= 50 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.ListeningOnTCPPortErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpErr[0]}</TableCell>
                        <TableCell align="right">&lt; 100</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpErr[0] <= 50 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.ListeningOnTCPPortSuccess.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpScc[0]}</TableCell>
                        <TableCell align="right">&lt; 50</TableCell>
                        <TableCell align="right">{this.state.gossip_listeningTcpScc[0] <= 50 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.IncomingConnection.TransportErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_transportErr[0]}</TableCell>
                        <TableCell align="right">&lt; 100</TableCell>
                        <TableCell align="right">{this.state.gossip_transportErr[0] <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.Active.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_outConnActive[0]}</TableCell>
                        <TableCell align="right">&lt; 100</TableCell>
                        <TableCell align="right">{this.state.gossip_outConnActive[0] <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.KeepaliveErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_keepAlive[0]}</TableCell>
                        <TableCell align="right">&lt; 100</TableCell>
                        <TableCell align="right">{this.state.gossip_keepAlive[0] <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.SendErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_sendErr[0]}</TableCell>
                        <TableCell align="right">&lt; 100</TableCell>
                        <TableCell align="right">{this.state.gossip_sendErr[0] <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Gossip.OutgoingConnection.SendQueueErrors.Count</TableCell>
                        <TableCell align="right">{this.state.gossip_sendQueueErr[0]}</TableCell>
                        <TableCell align="right">&lt; 100</TableCell>
                        <TableCell align="right">{this.state.gossip_sendQueueErr[0] <= 100 ? 
                            <Chip color="primary" label="success"/> : <Chip color="secondary" label="failure" /> }
                        </TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </Paper>
            </ThemeProvider>
            </div>
        );
    }
}

export default SimpleTable;