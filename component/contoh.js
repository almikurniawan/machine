// eslint-disable-next-line
import React from 'react';
import {
  List,
  Datagrid,
  FileInput,
  SaveButton,
  SimpleForm,
  TextInput,
  LongTextInput,
  Toolbar,
  UrlField,
  required,
  FileField
} from 'react-admin';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconCancel from '@material-ui/icons/Cancel';
import {Launcher} from 'react-chat-window';

import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import settings from '../settings';

import DateInput from '../components/DateInput';
import ActivateNurseAction from '../actions/ActivateNurseAction';

const styles = {
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 200,
    height: 200,
  },
  right: {
    float : 'right'
  },
  tab_content : {
    marginTop : "15px",
    color : "white"
  },
  linkClass : {
    color : "white",
    textDecoration : "underline"
  },
  marginTop : {
    marginTop : '15px'
  }
};

class GridProfil extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){
    this.props = nextProps;
  }

  componentDidMount(){
  }

  render(){
    let title = this.props.title;
    if(this.props.list) {
      this.props.list.map((value, index)=>{
        if(value.id==this.props.title){
          title = value.label;
        }
      });
    }
    return (
      <Grid item lg={this.props.width} sm={this.props.width}>
          <Typography variant="subheading" gutterBottom>
            {(this.props.titikdua) ? ": ":""}
            {
              (this.props.edit) ? 
                  this.props.list ? 
                  <Select
                    autoWidth={true}
                    value={this.props.title}
                    onChange={(e)=>this.props.onChange(e.target.value)}
                  >
                  {
                    this.props.list.map((value, index)=>{
                      return (<MenuItem key={Math.random()} value={value.id}>{value.label}</MenuItem>)
                    })
                  }
                  </Select>
                  :
                  <Input
                    onChange={(e)=>this.props.onChange(e.target.value)}
                    defaultValue={this.props.title}
                    inputProps={{
                      'aria-label': 'Description',
                    }}
                  />
                  :
                  title
            }
          </Typography> 
      </Grid>
    );
  }
}

const ToolbarNotif = props => (
  <Toolbar {...props} >
      <SaveButton label="Kirim"/>
      <Button label="ra.action.cancel" onClick={()=>{props.close()}}>
        <IconCancel /> Cancel
      </Button>
  </Toolbar>
);

class KeuanganDetailComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = 
    {
      "edit" : false,
      "open_dialog" : false,
      "data":{  
        "data_diri":{  
          "perawat_name":"",
          "perawat_no_ktp":null,
          "perawat_gelar_depan":null,
          "perawat_gelar_belakang":null,
          "perawat_email":"",
          "rek_perawat_norek":null,
          "rek_perawat_an":null,
          "ref_bank_short":null,
          "ref_univ_desc":"",
          "perawat_foto":"",
          "perawat_is_group": false
        },
        "data_saldo":false,
        "mutasi_saldo":[],
        "pencairan":[],
        "detail":{},
        "file_dokumen":[],
        "jadwal":[],
      "tindakan":[],
      "anggota":[]
      },
      "reference" : {
        "univ" : [],
        "bank" : []
      },
      "form":{
      },
      "activeTab":0,
      "messageList":[]
    }
  }

  componentDidMount(){
    this.getData();
    this.getReference();
    this.getPencairan();
    this.getDetail();
    this.getMessage();
  }

  componentWillReceiveProps(nextProps){
    this.props = nextProps;
  }

  setPage(url, props=null){
    this.props.history.push({
      pathname: '/'+url,
      state : props
    });
  }

  setEdit(edit){
    this.setState({
      edit : edit
    })
  }

  getMessage(){
    const self = this;
    let perawat_id = this.props.match.params.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/admin_chat_perawat/chat/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      this.setState({
        messageList : result.data
      })
    });
  }

  getData(){
    const self = this;
    let perawat_id = this.props.match.params.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/keuangan/dataPerawat/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      result.data.pencairan = self.state.data.pencairan;
      result.data.detail = self.state.data.detail;
      self.setState(result);
    });
  }

  getPencairan(){
    const self = this;
    let perawat_id = this.props.match.params.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/keuangan/pencairan/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      let {data} = self.state;
      data.pencairan = result.data;
      self.setState({data : data});
    });
  }

  getDetail(){
    const self = this;
    let perawat_id = this.props.match.params.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/keuangan/detailPerawat/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      let {data} = self.state;
      data.detail = result.data;
      self.setState({data : data});
    });
  }
  
  getReference(){
    const self = this;
    const token = localStorage.getItem('auth-token');
    fetch(settings.url+'/keuangan/reference',{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      self.setState(result);
    });
  }

  handleChange(state, value){
    let {form} = this.state;
    form[state] = value;
    this.setState({
      form : form
    })
  }

  save(){
    const self = this;
    const token = localStorage.getItem('auth-token');
    let data;
    let formData = new FormData();
    for (data in this.state.form) {
      formData.append(data, this.state.form[data]);
    }

    fetch(settings.url+'/keuangan/editNurse/'+this.props.match.params.id,{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body : formData
    })
    .then(res => res.json())
    .then(result => {
      self.setState(result);
    }).catch(e=>{
      self.setState({
        edit : true,
        openSnack : true,
        errorText : 'Terjadi Kesalahan'
      })
    });
  }

  upload(e){
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();
    formdata.append("file",e.files.rawFile);
    formdata.append("id",this.state.pengajuan_id);
    fetch(settings.url+'/keuangan/uploadBukti',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.setState({
          openDialog : false
        },()=>{
          self.getPencairan();
          self.getData();
        })
      }
    })
  }

  changeStatus(){
    const self =this;
    let perawat_id = this.props.match.params.id;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",this.state.pengajuan_id);
    formdata.append("status",this.state.form.perawat_validasi);
    fetch(settings.url+'/keuangan/status/'+perawat_id,{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.getData();
      }
    })
  }

  validasi(id){
    if(typeof id == "undefined"){
      alert("Errors");
    }
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",id);
    formdata.append("perawat_id",this.props.match.params.id);

    fetch(settings.url+'/keuangan/validasiFile',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.getData();
      }
    })
  }

  not_valid(id){
    if(typeof id == "undefined"){
      alert("Errors");
    }
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",id);
    formdata.append("perawat_id",this.props.match.params.id);

    fetch(settings.url+'/keuangan/notValid',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        this.setState({
          openSnack : true,
          errorText : 'Berkas tidak valid'
        },()=>{
          this.getData();
        })
      }
    })
  }

  batalValidasi(id){
    if(typeof id == "undefined"){
      alert("Errors");
    }
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",id);
    formdata.append("perawat_id",this.props.match.params.id);

    fetch(settings.url+'/keuangan/cancelValidasiFile',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.getData();
      }
    })
  }

  sendNotif(e) {
    const self =this;
    const token = localStorage.getItem('auth-token');
    let key;
    let formData = new FormData();
    for(key in e){
      formData.append(key, e[key]);
    }

    fetch(settings.url+'/keuangan/notifBelumLengkap/'+this.props.match.params.id,{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body : formData
    })
    .then(result => {
      return result.json();
    })
    .then(response => {
      let result = JSON.parse(response.notif);
      if(result.success==1){
        this.setState({
          openSnack : true,
          errorText : 'Terkirim',
          open_dialog : false
        })  
      }else{
        this.setState({
          openSnack : true,
          errorText : 'Erro : ' + response.notif,
          open_dialog : false
        })
      }
    });
  }

  renderTableMutasi(){
    return (
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>Waktu</TableCell>
            <TableCell >Jenis Transaksi</TableCell>
            <TableCell numeric>Nominal</TableCell>
            <TableCell numeric>Bagi Hasil</TableCell>
            <TableCell numeric>Total Terima</TableCell>
            <TableCell numeric>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            this.state.data.mutasi_saldo.map((value, key)=>{
              return (
                <TableRow key={Math.random()}>
                  <TableCell component="th" scope="row">
                    {value.waktu}
                  </TableCell>
                  <TableCell >{value.trx_tab_desc}</TableCell>
                  <TableCell numeric>{value.value_trx}</TableCell>
                  <TableCell numeric>{value.bagi_hasil}</TableCell>
                  <TableCell numeric>{value.total_terima}</TableCell>
                  <TableCell numeric>{value.balance}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    );
  }

  renderTablePengajuan(){
    return (
      <Grid container>
        <Grid item lg={12}>
          <Button color="primary" onClick={()=>this.setPage('keuangan/pengajuan/'+this.props.match.params.id,{ data : this.state.form})} className={classNames(this.props.classes.right)}><AddIcon /> Create Pengajuan Pencairan</Button>
        </Grid>
        <Grid item lg={12}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Waktu</TableCell>
                <TableCell numeric>Jumlah Transfer</TableCell>
                <TableCell >Norek</TableCell>
                <TableCell >Bank</TableCell>
                <TableCell >Atas Nama</TableCell>
                <TableCell >Ter-Verifikasi ?</TableCell>
                <TableCell >Jam Verifikasi</TableCell>
                <TableCell >Bukti Transfer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.data.pencairan.map((value, key)=>{
                  return (
                    <TableRow key={Math.random()}>
                      <TableCell >
                        {value.peng_datetime}
                      </TableCell>
                      <TableCell >{value.peng_value}</TableCell>
                      <TableCell >{value.peng_norek}</TableCell>
                      <TableCell >{value.ref_bank_desc}</TableCell>
                      <TableCell >{value.peng_an}</TableCell>
                      <TableCell >{value.is_transfered}</TableCell>
                      <TableCell >{value.peng_transfer_time}</TableCell>
                      <TableCell >{(value.peng_bukti_transfer==null) ? <Button size="small" onClick={()=>this.setState({openDialog:true, pengajuan_id : value.id})}>Upload</Button>:<a href={settings.url+'/bukti_transfer/'+value.peng_bukti_transfer} target='new'>{value.peng_bukti_transfer}</a>}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }

  renderFile(){
    return this.state.data.file_dokumen.map((value, index)=>{
      return (
          <TableRow key={Math.random()}>
            <TableCell >
              {value.desc}
            </TableCell>
            <TableCell>
              {
                (value.file==null) ? 'Belum Ada' : <a target="_new" className={this.props.classes.linkClass} href={"/api/public_html/"+value.file}>File</a>
              }
            </TableCell>
            <TableCell >
              {value.status}
            </TableCell>
            <TableCell>
            {
              (value.file!=null) ? 
                (!value.validasi) ? <div><Button variant="contained" size="small" color="primary" onClick={()=>this.validasi(value.id)}>Validasi</Button> <Button variant="contained" size="small" color="secondary" onClick={()=>this.not_valid(value.id)}>Tidak Valid</Button></div> : <Button variant="contained" size="small" color="secondary" onClick={()=>this.batalValidasi(value.id)}>Batal Valid</Button> : ''
            }
            </TableCell>
          </TableRow>
      );
    })
  }

  renderJadwal(){
    return this.state.data.jadwal.map((value, index)=>{
      return (
          <TableRow key={Math.random()}>
            <TableCell >
              {value.ref_hari_nama}
            </TableCell>
            <TableCell>{value.pw_begin} - {value.pw_end}</TableCell>
          </TableRow>
      );
    })
  }

  renderTindakan(){
    return this.state.data.tindakan.map((value, index)=>{
      return (
          <TableRow key={Math.random()}>
            <TableCell >
              {value.tind_desc}
            </TableCell>
            <TableCell numeric>{value.harga}</TableCell>
          </TableRow>
      );
    })
  }

  renderDetail(){
    let component = [];
    let key;
    for(key in this.state.data.detail){
      component.push(
        <Grid key={Math.random()} item lg={6} sm={6} className={this.props.classes.tab_content}>
          <Grid container>
            <Grid item lg={4} sm={4}>
              {key.replace(new RegExp(/perawat|_/,"g")," ")}
            </Grid>
            <Grid item lg={4} sm={4}>
              : {this.state.data.detail[key]}
            </Grid>
          </Grid>
        </Grid>
      );
    }

    return (
      <div>
        <Grid container>
          {component}
        </Grid>
        <Grid container className={this.props.classes.marginTop}>
            <Dialog
              fullWidth
              open={this.state.open_dialog}
              aria-label="Send Notif">
              <DialogTitle>Send Notif</DialogTitle>
              <DialogContent>
                  <SimpleForm
                      // We want no toolbar at all as we have our modal actions
                      save={(e)=>this.sendNotif(e)}
                      toolbar={<ToolbarNotif close={()=>this.setState({
                        open_dialog : false
                      })}/>}
                      >
                      <LongTextInput
                          source="keterangan"
                          validate={required()}
                          defaultValue="Berkas anda belum lengkap"
                          resettable 
                      />
                  </SimpleForm>
              </DialogContent>
            </Dialog>
            <Grid item lg={12} sm={12}>
            <hr/>
            </Grid>
            <Grid item lg={12} sm={12}>
              <Typography variant="title" gutterBottom>
                List Sertifikat
              </Typography>
            </Grid>
            <Grid item lg={10} sm={12}>
              <Button variant="contained" size="small" color="secondary" onClick={()=>{this.setState({
                open_dialog : true
              })}}>Belum Lengkap</Button>
            </Grid>
            <Grid item lg={12} sm={12}>
              <Table >
                <TableHead>
                  <TableRow>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell >File</TableCell>
                    <TableCell >Status</TableCell>
                    <TableCell >Valid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.renderFile()}
                </TableBody>
              </Table>
            </Grid>
        </Grid>
        <Grid container className={this.props.classes.marginTop}>
            <Grid item lg={12} sm={12}>
            <hr/>
            </Grid>
            <Grid container  justify="space-between">
              <Grid item lg={5} sm={5}>
                <Typography variant="title" gutterBottom>
                  Jadwal
                </Typography>
              </Grid>
              <Grid item lg={6} sm={6}>
                <Typography variant="title" gutterBottom>
                  Tindakan
                </Typography>
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item lg={5} sm={5}>
                    <Table >
                      <TableHead>
                        <TableRow>
                          <TableCell>Hari</TableCell>
                          <TableCell >Jam</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.renderJadwal()}
                      </TableBody>
                    </Table>
              </Grid>
              <Grid item lg={6} sm={6}>
                <Table >
                  <TableHead>
                    <TableRow>
                      <TableCell>Tindakan</TableCell>
                      <TableCell >Tarif</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.renderTindakan()}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
        </Grid>
      </div>
    );
  }
  
  renderAnggota(){
    return(
      <Grid container className={this.props.classes.marginTop}>
        <Grid item lg={12} sm={12}>
          <Typography variant="title" gutterBottom>
          List Anggota
          </Typography>
        </Grid>
        <Grid item lg={12} sm={12}>
          <Table >
          <TableHead>
            <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell >Telp</TableCell>
            <TableCell >Email</TableCell>
            <TableCell >Nomor Kontrak</TableCell>
            <TableCell >Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderTableAnggota()}
          </TableBody>
          </Table>
        </Grid>
      </Grid>
    )
  }

  renderTableAnggota(){
    return this.state.data.anggota.map((value, index)=>{
      return (
        <TableRow key={Math.random()}>
          <TableCell>
          {value.anggota_namalengkap}
          </TableCell>
          <TableCell>
          {value.no_telp}
          </TableCell>
          <TableCell>{value.anggota_email}</TableCell>
          <TableCell>{value.anggota_nomor_kontrak}</TableCell>
          <TableCell>
            <Button color="primary" onClick={()=>this.setPage('nomorAnggota/'+value.anggota_id, null)}>Nomor Kontrak</Button>
          </TableCell>
        </TableRow>
      );
    })
  }

  _onMessageWasSent(obj, perawat_id){
    // Now send the message throught the backend API
    // console.log(obj, perawat_id);
    const token = localStorage.getItem('auth-token');
    let formData = new FormData();
    formData.append('perawat_id', perawat_id);
    formData.append('pesan', obj.data.text);
    fetch(settings.url+'/admin_chat_perawat/kirim',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body : formData
    })
    .then(res => res.json())
    .then(result => {
      this.getMessage();
    }).catch(e=>{
      self.setState({
        edit : true,
        openSnack : true,
        errorText : 'Terjadi Kesalahan'
      })
    });    
  }

  render(){
    const classes = this.props.classes;
    let photo_profile = (this.state.data.data_diri.perawat_foto==null) ? 'upload/nurse-icon.jpg' : this.state.data.data_diri.perawat_foto;
    return (
      <Card >
        <Dialog
          open={this.state.openDialog}
          onClose={()=>this.setState({openDialog : false})}
          TransitionComponent={Transition}
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Upload Bukti Transfer</DialogTitle>
          <DialogContent>
            <SimpleForm save={(e)=>this.upload(e)}>
              <FileInput source="files" label="Related files" accept=".jpeg, .jpg, .png">
                <FileField source="src" title="title" />
              </FileInput>
            </SimpleForm>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.setState({openDialog : false})} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <CardContent>
          <Grid container spacing={16} >
            <Grid item lg={8} sm={8}>
              <Typography variant="title" gutterBottom>
                {(this.state.data.data_diri.perawat_is_group) ? 'Klinik':'Perawat'} Profil
              </Typography>
            </Grid>
            <Grid item lg={4} sm={4}>
              <Button color="primary" onClick={()=>{
                (this.state.data.data_diri.perawat_is_group) ? this.setPage('klinik'):this.setPage('nurses')
              }}><ListIcon /> List {(this.state.data.data_diri.perawat_is_group) ? 'Klinik':'Perawat'}</Button>
              {(!this.state.edit) ? 
                <Button color="primary" onClick={()=>this.setEdit(true)}><EditIcon /> Edit</Button>
                :
                <Button color="primary" onClick={()=>{
                  this.setEdit(false)
                  this.save()
              }}><SaveIcon /> Save</Button>
              }
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item lg={3} sm={3}>
              <Avatar
                src={"https://ark.my-ners.com:15443/api/public_html/"+photo_profile}
                className={classNames(classes.avatar, classes.bigAvatar)}
              />
            </Grid>
            <Grid item lg={6} sm={6} container>
              <GridProfil width={3} title="Nama" />
              <GridProfil width={9} title={this.state.form.perawat_name} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('perawat_name',e)} onChange={(e)=>this.handleChange('perawat_name',e)} />
              <GridProfil width={3} title="NIK" />
              <GridProfil width={9} title={this.state.form.perawat_no_ktp} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('perawat_no_ktp',e)} />
              <GridProfil width={3} title="Universitas" />
              <GridProfil width={9} title={this.state.form.perawat_id_sekolah_asal} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('perawat_id_sekolah_asal',e)} list={this.state.reference.univ} />
              <GridProfil width={3} title="Email" />
              <GridProfil width={9} title={this.state.form.perawat_email} titikdua />
              <GridProfil width={3} title="NO. REK" />
              <GridProfil width={9} title={this.state.form.rek_perawat_norek} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('rek_perawat_norek',e)} />
              <GridProfil width={3} title="BANK" />
              <GridProfil width={9} title={this.state.form.rek_perawat_bank} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('rek_perawat_bank',e)} list={this.state.reference.bank} />
              <GridProfil width={3} title="Atas Nama" />
              <GridProfil width={9} title={this.state.form.rek_perawat_an} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('rek_perawat_an',e)} />

              <GridProfil width={3} title="Status" />
              <Grid item lg={9} sm={9}>
                <Button onClick={()=>this.changeStatus()} color={(this.state.form.perawat_validasi) ? "primary":"primary"}> {this.state.form.perawat_validasi ? 'Non Aktifkan':'Aktifkan'}</Button>
              </Grid>
            </Grid>
            <Grid item lg={3} sm={3}>
              <GridProfil width={12} title="Saldo Saat Ini" />
              <GridProfil width={12} title={"Rp. "+this.state.data.data_saldo.perawat_balance} />
            </Grid>
          </Grid>
          <Typography variant="title" gutterBottom>
            Detail Transaksi {(this.state.data.data_diri.perawat_is_group) ?  'Klinik':'Perawat'}
          </Typography>
          <Tabs textColor="white" value={this.state.activeTab} onChange={(e, value)=>this.setState({activeTab:value})} >
            <Tab label="Detail" />
            <Tab label="Mutasi Saldo" />
            <Tab label="Pengajuan Pencairan" />
            {
              (this.state.data.data_diri.perawat_is_group) ?
                <Tab label="Daftar Anggota" /> : ''
            }
          </Tabs>
          {
            (this.state.activeTab==0) ? 
              this.renderDetail() : 
                (this.state.activeTab==1) ?
                  this.renderTableMutasi() : (this.state.activeTab==2) ?
                    this.renderTablePengajuan() : this.renderAnggota()
          }
          
        </CardContent>
      
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.openSnack}
          onClose={()=>this.setState({openSnack : false})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.errorText}</span>}
        />
        <Launcher
          agentProfile={{
            teamName: this.state.data.data_diri.perawat_name,
            // imageUrl: "https://ark.my-ners.com:15443/api/public_html/"+photo_profile
          }}
          onMessageWasSent={(obj)=>this._onMessageWasSent(obj, this.props.match.params.id)}
          messageList={this.state.messageList}
          showEmoji
        />
      </Card>
    );
  }
}

// const ChatItem = props => {
//   console.log(props,"ini props");
//   // return props.map((value,index)=>{
//   //     return (
// return (        <Grid container>
//           <Grid item lg={2}>
//           <Avatar
//               src={props[0].photo}
//           />
//           </Grid>
//           <Grid item lg={10}>
//             <Grid container>
//               <Grid item lg={12}>
//                 <bold>Admin</bold>  <em>{props[0].pesan_created_at}</em>
//               </Grid>
//               <Grid item lg={12}>
//                 <div className="rcw-message">
//                   <div className="rcw-response">
//                     <div className="rcw-message-text">
//                       <p>{props[0].pesan_text}</p>
//                     </div>
//                   </div>
//                 </div>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       )
  
// }

class KeuanganDetailKlinikComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = 
    {
      "edit" : false,
      "data":{  
        "data_diri":{  
          "perawat_name":"",
          "perawat_no_ktp":null,
          "perawat_gelar_depan":null,
          "perawat_gelar_belakang":null,
          "perawat_email":"",
          "rek_perawat_norek":null,
          "rek_perawat_an":null,
          "ref_bank_short":null,
          "ref_univ_desc":"",
          "perawat_foto":"",
          "perawat_is_group": false
        },
        "data_saldo":false,
        "mutasi_saldo":[],
        "pencairan":[],
        "detail":{},
        "file_dokumen":[],
        "jadwal":[],
        "tindakan":[],
        "anggota":[]
        },
        "reference" : {
          "univ" : [],
          "bank" : []
        },
        "form":{
        },
        "activeTab":0,
        "messageList" : []
    }
  }

  componentDidMount(){
    this.getData();
    this.getReference();
    this.getPencairan();
    this.getDetail();
    this.getMessage();
  }

  componentWillReceiveProps(nextProps){
    this.props = nextProps;
  }

  setPage(url, props=null){
    this.props.history.push({
      pathname: '/'+url,
      state : props
    });
  }

  setEdit(edit){
    this.setState({
      edit : edit
    })
  }

  getMessage(){
    const self = this;
    let perawat_id = this.props.match.params.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/admin_chat_perawat/chat/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      this.setState({
        messageList : result.data
      })
    });
  }

  getData(){
    const self = this;
    let perawat_id = this.props.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/keuangan/dataPerawat/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      result.data.pencairan = self.state.data.pencairan;
      result.data.detail = self.state.data.detail;
      self.setState(result);
    });
  }

  getPencairan(){
    const self = this;
    let perawat_id = this.props.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/keuangan/pencairan/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      let {data} = self.state;
      data.pencairan = result.data;
      self.setState({data : data});
    });
  }

  getDetail(){
    const self = this;
    let perawat_id = this.props.id;
    const token = localStorage.getItem('auth-token');

    fetch(settings.url+'/keuangan/detailklinik/'+perawat_id,{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      let {data} = self.state;
      data.detail = result.data;
      self.setState({data : data});
    });
  }
  
  getReference(){
    const self = this;
    const token = localStorage.getItem('auth-token');
    fetch(settings.url+'/keuangan/reference',{
      method : 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(result => {
      self.setState(result);
    });
  }

  handleChange(state, value){
    let {form} = this.state;
    form[state] = value;
    this.setState({
      form : form
    })
  }

  save(){
    const self = this;
    const token = localStorage.getItem('auth-token');
    let data;
    let formData = new FormData();
    for (data in this.state.form) {
      formData.append(data, this.state.form[data]);
    }

    fetch(settings.url+'/keuangan/editNurse/'+this.props.id,{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body : formData
    })
    .then(res => res.json())
    .then(result => {
      self.setState(result);
    }).catch(e=>{
      self.setState({
        edit : true,
        openSnack : true,
        errorText : 'Terjadi Kesalahan'
      })
    });
  }

  upload(e){
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();
    formdata.append("file",e.files.rawFile);
    formdata.append("id",this.state.pengajuan_id);
    fetch(settings.url+'/keuangan/uploadBukti',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.setState({
          openDialog : false
        },()=>{
          self.getPencairan();
          self.getData();
        })
      }
    })
  }

  changeStatus(){
    const self =this;
    let perawat_id = this.props.id;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",this.state.pengajuan_id);
    formdata.append("status",this.state.form.perawat_validasi);
    fetch(settings.url+'/keuangan/status/'+perawat_id,{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.getData();
      }
    })
  }

  validasi(id){
    if(typeof id == "undefined"){
      alert("Errors");
    }
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",id);
    formdata.append("perawat_id",this.props.id);

    fetch(settings.url+'/keuangan/validasiFile',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.getData();
      }
    })
  }

  not_valid(id){
    if(typeof id == "undefined"){
      alert("Errors");
    }
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",id);
    formdata.append("perawat_id",this.props.id);

    fetch(settings.url+'/keuangan/validasiFile',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.getData();
      }
    })
  }

  batalValidasi(id){
    if(typeof id == "undefined"){
      alert("Errors");
    }
    const self =this;
    const token = localStorage.getItem('auth-token');
    let formdata = new FormData();    
    formdata.append("id",id);
    formdata.append("perawat_id",this.props.id);

    fetch(settings.url+'/keuangan/cancelValidasiFile',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }), 
      body : formdata
    })
    .then(result=>{
      if(result.status){
        self.getData();
      }
    })
  }

  renderTableMutasi(){
    return (
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>Waktu</TableCell>
            <TableCell >Jenis Transaksi</TableCell>
            <TableCell numeric>Nominal</TableCell>
            <TableCell numeric>Bagi Hasil</TableCell>
            <TableCell numeric>Total Terima</TableCell>
            <TableCell numeric>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            this.state.data.mutasi_saldo.map((value, key)=>{
              return (
                <TableRow key={Math.random()}>
                  <TableCell component="th" scope="row">
                    {value.waktu}
                  </TableCell>
                  <TableCell >{value.trx_tab_desc}</TableCell>
                  <TableCell numeric>{value.value_trx}</TableCell>
                  <TableCell numeric>{value.bagi_hasil}</TableCell>
                  <TableCell numeric>{value.total_terima}</TableCell>
                  <TableCell numeric>{value.balance}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    );
  }

  renderTablePengajuan(){
    return (
      <Grid container>
        <Grid item lg={12}>
          <Button color="primary" onClick={()=>this.setPage('keuangan/pengajuan/'+this.props.id,{data : this.state.form})} className={classNames(this.props.classes.right)}><AddIcon /> Create Pengajuan Pencairan</Button>
        </Grid>
        <Grid item lg={12}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Waktu</TableCell>
                <TableCell numeric>Jumlah Transfer</TableCell>
                <TableCell >Norek</TableCell>
                <TableCell >Bank</TableCell>
                <TableCell >Atas Nama</TableCell>
                <TableCell >Ter-Verifikasi ?</TableCell>
                <TableCell >Jam Verifikasi</TableCell>
                <TableCell >Bukti Transfer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.data.pencairan.map((value, key)=>{
                  return (
                    <TableRow key={Math.random()}>
                      <TableCell >
                        {value.peng_datetime}
                      </TableCell>
                      <TableCell >{value.peng_value}</TableCell>
                      <TableCell >{value.peng_norek}</TableCell>
                      <TableCell >{value.ref_bank_desc}</TableCell>
                      <TableCell >{value.peng_an}</TableCell>
                      <TableCell >{value.is_transfered}</TableCell>
                      <TableCell >{value.peng_transfer_time}</TableCell>
                      <TableCell >{(value.peng_bukti_transfer==null) ? <Button size="small" onClick={()=>this.setState({openDialog:true, pengajuan_id : value.id})}>Upload</Button>:<a href={settings.url+'/bukti_transfer/'+value.peng_bukti_transfer} target='new'>{value.peng_bukti_transfer}</a>}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }

  renderFile(){
    return this.state.data.file_dokumen.map((value, index)=>{
      return (
          <TableRow key={Math.random()}>
            <TableCell >
              {value.desc}
            </TableCell>
            <TableCell>
              {
                (value.file==null) ? 'Belum Ada' : <a target="_new" className={this.props.classes.linkClass} href={"/api/public_html/"+value.file}>File</a>
              }
            </TableCell>
            <TableCell >
              {value.status}
            </TableCell>
            <TableCell >{(!value.validasi) ? <Button variant="contained" size="small" color="primary" onClick={()=>this.validasi(value.id)}>Validasi</Button>:<Button variant="contained" size="small" color="secondary" onClick={()=>this.batalValidasi(value.id)}>Batal Valid</Button>}</TableCell>
          </TableRow>
      );
    })
  }

  renderJadwal(){
    return this.state.data.jadwal.map((value, index)=>{
      return (
          <TableRow key={Math.random()}>
            <TableCell >
              {value.ref_hari_nama}
            </TableCell>
            <TableCell>{value.pw_begin} - {value.pw_end}</TableCell>
          </TableRow>
      );
    })
  }

  renderTindakan(){
    return this.state.data.tindakan.map((value, index)=>{
      return (
          <TableRow key={Math.random()}>
            <TableCell >
              {value.tind_desc}
            </TableCell>
            <TableCell numeric>{value.harga}</TableCell>
          </TableRow>
      );
    })
  }

  renderDetail(){
    let component = [];
    let key;
    for(key in this.state.data.detail){
      component.push(
        <Grid key={Math.random()} item lg={6} sm={6} className={this.props.classes.tab_content}>
          <Grid container>
            <Grid item lg={4} sm={4}>
              {key.replace(new RegExp(/perawat|_/,"g")," ")}
            </Grid>
            <Grid item lg={4} sm={4}>
              : {this.state.data.detail[key]}
            </Grid>
          </Grid>
        </Grid>
      );
    }

    return (
      <div>
        <Grid container>
          {component}
        </Grid>
        <Grid container className={this.props.classes.marginTop}>
            <Grid item lg={12} sm={12}>
            <hr/>
            </Grid>
            <Grid container  justify="space-between">
              <Grid item lg={5} sm={5}>
                <Typography variant="title" gutterBottom>
                  Jadwal
                </Typography>
              </Grid>
              <Grid item lg={6} sm={6}>
                <Typography variant="title" gutterBottom>
                  Tindakan
                </Typography>
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item lg={5} sm={5}>
                    <Table >
                      <TableHead>
                        <TableRow>
                          <TableCell>Hari</TableCell>
                          <TableCell >Jam</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.renderJadwal()}
                      </TableBody>
                    </Table>
              </Grid>
              <Grid item lg={6} sm={6}>
                <Table >
                  <TableHead>
                    <TableRow>
                      <TableCell>Tindakan</TableCell>
                      <TableCell >Tarif</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.renderTindakan()}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
        </Grid>
      </div>
    );
  }
  
  renderAnggota(){
    return(
      <Grid container className={this.props.classes.marginTop}>
        <Grid item lg={12} sm={12}>
          <Typography variant="title" gutterBottom>
          List Anggota
          </Typography>
        </Grid>
        <Grid item lg={12} sm={12}>
          <Table >
          <TableHead>
            <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell >Telp</TableCell>
            <TableCell >Email</TableCell>
            <TableCell >Nomor Kontrak</TableCell>
            <TableCell >Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderTableAnggota()}
          </TableBody>
          </Table>
        </Grid>
      </Grid>
    )
  }

  renderTableAnggota(){
    return this.state.data.anggota.map((value, index)=>{
      return (
        <TableRow key={Math.random()}>
          <TableCell>
          {value.anggota_namalengkap}
          </TableCell>
          <TableCell>
          {value.no_telp}
          </TableCell>
          <TableCell>{value.anggota_email}</TableCell>
          <TableCell>{value.anggota_nomor_kontrak}</TableCell>
          <TableCell>
            <Button color="primary" onClick={()=>this.setPage('nomorAnggota/'+value.anggota_id, null)}>Nomor Kontrak</Button>
          </TableCell>
        </TableRow>
      );
    })
  }

  _onMessageWasSent(obj, perawat_id){
    // Now send the message throught the backend API
    // console.log(obj, perawat_id);
    const token = localStorage.getItem('auth-token');
    let formData = new FormData();
    formData.append('perawat_id', perawat_id);
    formData.append('pesan', obj.data.text);
    fetch(settings.url+'/admin_chat_perawat/kirim',{
      method : 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body : formData
    })
    .then(res => res.json())
    .then(result => {
      this.getMessage();
    }).catch(e=>{
      self.setState({
        edit : true,
        openSnack : true,
        errorText : 'Terjadi Kesalahan'
      })
    });    
  }

  render(){
    const classes = this.props.classes;
    let photo_profile = (this.state.data.data_diri.perawat_foto==null) ? 'upload/nurse-icon.jpg' : this.state.data.data_diri.perawat_foto;
    return (
      <Card >
        <Dialog
          open={this.state.openDialog}
          onClose={()=>this.setState({openDialog : false})}
          TransitionComponent={Transition}
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Upload Bukti Transfer</DialogTitle>
          <DialogContent>
            <SimpleForm save={(e)=>this.upload(e)}>
              <FileInput source="files" label="Related files" accept=".jpeg, .jpg, .png">
                <FileField source="src" title="title" />
              </FileInput>
            </SimpleForm>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.setState({openDialog : false})} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <CardContent>
          <Grid container spacing={16} >
            <Grid item lg={8} sm={8}>
              <Typography variant="title" gutterBottom>
                {(this.state.data.data_diri.perawat_is_group) ? 'Klinik':'Perawat'} Profil
              </Typography>
            </Grid>
            <Grid item lg={4} sm={4}>
              <Button color="primary" onClick={()=>{
                (this.state.data.data_diri.perawat_is_group) ? this.setPage('klinik'):this.setPage('nurses')
              }}><ListIcon /> List {(this.state.data.data_diri.perawat_is_group) ? 'Klinik':'Perawat'}</Button>
              {(!this.state.edit) ? 
                <Button color="primary" onClick={()=>this.setEdit(true)}><EditIcon /> Edit</Button>
                :
                <Button color="primary" onClick={()=>{
                  this.setEdit(false)
                  this.save()
              }}><SaveIcon /> Save</Button>
              }
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item lg={3} sm={3}>
              <Avatar
                src={"https://ark.my-ners.com:15443/api/public_html/"+photo_profile}
                className={classNames(classes.avatar, classes.bigAvatar)}
              />
            </Grid>
            <Grid item lg={6} sm={6} container>
              <GridProfil width={3} title="Nama" />
              <GridProfil width={9} title={this.state.form.perawat_name} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('perawat_name',e)} onChange={(e)=>this.handleChange('perawat_name',e)} />
              <GridProfil width={3} title="Email" />
              <GridProfil width={9} title={this.state.form.perawat_email} titikdua />
              <GridProfil width={3} title="NO. REK" />
              <GridProfil width={9} title={this.state.form.rek_perawat_norek} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('rek_perawat_norek',e)} />
              <GridProfil width={3} title="BANK" />
              <GridProfil width={9} title={this.state.form.rek_perawat_bank} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('rek_perawat_bank',e)} list={this.state.reference.bank} />
              <GridProfil width={3} title="Atas Nama" />
              <GridProfil width={9} title={this.state.form.rek_perawat_an} titikdua edit={this.state.edit}  onChange={(e)=>this.handleChange('rek_perawat_an',e)} />

              <GridProfil width={3} title="Status" />
              <Grid item lg={9} sm={9}>
                <Button onClick={()=>this.changeStatus()} color={(this.state.form.perawat_validasi) ? "primary":"primary"}> {this.state.form.perawat_validasi ? 'Non Aktifkan':'Aktifkan'}</Button>
              </Grid>
            </Grid>
            <Grid item lg={3} sm={3}>
              <GridProfil width={12} title="Saldo Saat Ini" />
              <GridProfil width={12} title={"Rp. "+this.state.data.data_saldo.perawat_balance} />
            </Grid>
          </Grid>
          <Typography variant="title" gutterBottom>
            Detail Transaksi {(this.state.data.data_diri.perawat_is_group) ?  'Klinik':'Perawat'}
          </Typography>
          <Tabs textColor="white" value={this.state.activeTab} onChange={(e, value)=>this.setState({activeTab:value})} >
            <Tab label="Detail" />
            <Tab label="Mutasi Saldo" />
            <Tab label="Pengajuan Pencairan" />
            {
              (this.state.data.data_diri.perawat_is_group) ?
                <Tab label="Daftar Anggota" /> : ''
            }
          </Tabs>
          {
            (this.state.activeTab==0) ? 
              this.renderDetail() : 
                (this.state.activeTab==1) ?
                  this.renderTableMutasi() : (this.state.activeTab==2) ?
                    this.renderTablePengajuan() : this.renderAnggota()
          }
          
        </CardContent>
      
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.openSnack}
          onClose={()=>this.setState({openSnack : false})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.errorText}</span>}
        />
        <Launcher
          agentProfile={{
            teamName: this.state.data.data_diri.perawat_name,
            // imageUrl: "https://ark.my-ners.com:15443/api/public_html/"+photo_profile
          }}
          onMessageWasSent={(obj)=>this._onMessageWasSent(obj, this.props.match.params.id)}
          messageList={this.state.messageList}
          showEmoji
        />
      </Card>
    );
  }
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


// export default withStyles(styles)(KeuanganDetail);
const KeuanganDetail = withStyles(styles)(KeuanganDetailComponent);
const KeuanganDetailKlinik = withStyles(styles)(KeuanganDetailKlinikComponent);
export {KeuanganDetail, KeuanganDetailKlinik};