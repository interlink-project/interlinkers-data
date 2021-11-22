import React, { useState, useEffect } from "react";
import { TextField as MuiTextField, Alert, Grid, Box, Stack, Button, Typography, IconButton, Menu, MenuItem, Paper, MenuList, ListItemIcon, ListItemText, Divider, CardHeader } from "@material-ui/core";
import { useDispatch, useSelector } from 'react-redux';
import { Save, MoreVert, ContentCopy, ContentCut, Cloud, ContentPaste, Delete, Add, Edit, Share } from '@material-ui/icons';

import { Formik, Field, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { updateProcess } from "slices/process";
import QuillEditor from "components/QuillEditor";
import $ from 'jquery';
import { Prompt } from 'react-router-dom'
import MainSkeleton from "pages/dashboard/processes/Tabs/MainSkeleton";
import moment from "moment";


const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangouts Call',
    'Luna',
    'Oberon',
    'Phobos',
    'Pyxis',
    'Sedna',
    'Titania',
    'Triton',
    'Umbriel',
];

const ITEM_HEIGHT = 48;

const OverviewTab = () => {
    const [editMode, setEditMode] = useState(false)
    const [initialData, setInitialData] = useState({})
    const { process, updating } = useSelector((state) => state.process);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const PromptIfDirty = () => {
        const formik = useFormikContext();
        return (
            <Prompt
                when={formik.dirty && formik.submitCount === 0}
                message="Are you sure you want to leave? You have with unsaved changes."
            />
        );
    };

    const dispatch = useDispatch();

    useEffect(() => {
        if (!editMode) {
            $(".ql-toolbar").remove()

        }
        setInitialData({
            name: process.name || "",
            description: process.description || "",
            organization: process.organization || "",
            aim: process.aim || "",
            idea: process.idea || "",
            challenges: process.challenges || "",
            submit: null
        })
    }, [editMode, process]);

    const QuillField = (props) => <>
        <Typography variant="overline" display="block" gutterBottom color="primary">
            {props.label}
        </Typography>

        <Field name={props.name}>
            {({ field }) => <QuillEditor readOnly={!editMode}
                placeholder='Write something'
                sx={{ minHeight: props.height, borderColor: "background.paper", backgroundColor: editMode && "background.default" }}
                {...props}
                value={field.value} onChange={field.onChange(field.name)} />}
        </Field>
    </>

    const TextField = (props) => <>
        <Typography variant="overline" display="block" gutterBottom color="primary">
            {props.label}
        </Typography>
        <MuiTextField
            fullWidth
            minRows={4}
            variant={editMode ? "filled" : "standard"}
            InputProps={{
                readOnly: !editMode,
            }}
            {...props}
            label={null}
            name={props.name}
        />
    </>

    if (updating) {
        return <MainSkeleton />
    }

    return (
        <Box style={{ minHeight: "85vh", backgroundColor: "background.default" }}>


            {editMode && <Alert severity="warning" sx={{ width: '100%' }}>
                Editing mode. Do not forget to save the changes
            </Alert>}
            <CardHeader
                action={
                    <IconButton aria-label="settings"
                        aria-label="more"
                        id="long-button"
                        aria-controls="long-menu"
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                }
                title={`Metadata of '${process.name}' coproduction process`}
                subheader={`Created: ${moment(process.created_at).format("LL")} | Last update: ${moment(process.updated_at).format("LLL")}`}
            />
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuList>
                    <MenuItem onClick={() => {setEditMode(true); handleClose()}}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <Share fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Share</ListItemText>

                    </MenuItem>

                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>


            <Formik
                initialValues={{
                    name: process.name || "",
                    description: process.description || "",
                    organization: process.organization || "",
                    aim: process.aim || "",
                    idea: process.idea || "",
                    challenges: process.challenges || "",
                    submit: null
                }}
                validationSchema={Yup
                    .object()
                    .shape({
                        name: Yup.string().required('Required'),
                        description: Yup.string().required('required'),
                        aim: Yup.string().required('required'),
                        organization: Yup.string().required('required'),
                        idea: Yup.string().required('required'),
                        challenges: Yup.string().required('required'),

                    })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        dispatch(updateProcess({
                            id: process.id,
                            data: values,
                            onSuccess: () => {
                                setEditMode(false)
                                setStatus({ success: true });
                                setSubmitting(false);
                            }
                        }))

                    } catch (err) {
                        console.error(err);
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    setFieldTouched,
                    resetForm,
                    touched,
                    values
                }) => (
                    <Form>
                        <PromptIfDirty />
                        <Grid container sx={{ width: "96%", ml: 2, justifyContent: "center" }} spacing={2} >
                            <Grid item xs={12}>
                                <TextField label="NAME OF THE PROJECT" helperText={touched.name && errors.name} error={Boolean(touched.name && errors.name)} value={values.name} onBlur={handleBlur} onChange={handleChange} name="name" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="SHORT DESCRIPTION OF THE PROJECT" multiline helperText={touched.description && errors.description} error={Boolean(touched.description && errors.description)} value={values.description} onBlur={handleBlur} onChange={handleChange} name="description" />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField label="ACTUAL ORGANIZATION OF THE SERVICE" multiline helperText={touched.organization && errors.organization} error={Boolean(touched.organization && errors.organization)} value={values.organization} onBlur={handleBlur} onChange={handleChange} name="organization" />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField label="AIM OF THE PROJECT" multiline helperText={touched.aim && errors.aim} error={Boolean(touched.aim && errors.aim)} value={values.aim} onBlur={handleBlur} onChange={handleChange} name="aim" />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <QuillField
                                    label="IDEA OF SERVICE TO BE CO-DELIVERED"
                                    helperText={touched.idea && errors.idea}
                                    error={Boolean(touched.idea && errors.idea)}
                                    value={values.idea}
                                    name="idea"
                                    height={200}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <QuillField
                                    label="CHALLENGES OF THE PROJECT"
                                    helperText={touched.challenges && errors.challenges}
                                    error={Boolean(touched.challenges && errors.challenges)}
                                    value={values.challenges} name="challenges"
                                    height={200}
                                />
                            </Grid>

                        </Grid>
                        {editMode && <Stack direction="row" spacing={2} sx={{ justifyContent: "center", mt: 3, mb: 2 }}>
                            <Button variant="text" disabled={isSubmitting} color="error" startIcon={<Delete />} onClick={() => { resetForm(); setEditMode(false) }}> Cancel</Button>
                            <Button variant="contained" disabled={isSubmitting} color="success" startIcon={<Save />} type='submit'> Save</Button>  </Stack>}
                    </Form>
                )}
            </Formik>




        </Box>
    );
};

export default OverviewTab