/* Small, dependency-free Windows launcher. The UI is embedded at build time. */
#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif
#include <windows.h>
#include <shlobj.h>
#include <shlwapi.h>
#include <stdio.h>
#include "embedded_ui.h"
static int fail(const wchar_t *message){MessageBoxW(NULL,message,L"Daytone",MB_OK|MB_ICONERROR);return 1;}
int WINAPI wWinMain(HINSTANCE instance,HINSTANCE previous,PWSTR command,int show){
 wchar_t base[MAX_PATH],dir[MAX_PATH],html[MAX_PATH],temp[MAX_PATH],profile[MAX_PATH],edge[MAX_PATH],url[2048],args[4096];
 if(FAILED(SHGetFolderPathW(NULL,CSIDL_LOCAL_APPDATA,NULL,SHGFP_TYPE_CURRENT,base)))return fail(L"Could not locate your local application data folder.");
 if(wcslen(base)>MAX_PATH-55)return fail(L"Your application data path is too long for this demo.");
 swprintf(dir,MAX_PATH,L"%ls\\DaytoneDemo",base);CreateDirectoryW(dir,NULL);
 swprintf(html,MAX_PATH,L"%ls\\index.html",dir);swprintf(temp,MAX_PATH,L"%ls\\index.tmp",dir);swprintf(profile,MAX_PATH,L"%ls\\EdgeProfile",dir);
 HANDLE mutex=CreateMutexW(NULL,FALSE,L"Local\\DaytoneDemoWriteUI");if(!mutex)return fail(L"Could not start Daytone.");WaitForSingleObject(mutex,INFINITE);
 HANDLE f=CreateFileW(temp,GENERIC_WRITE,0,NULL,CREATE_ALWAYS,FILE_ATTRIBUTE_NORMAL,NULL);if(f==INVALID_HANDLE_VALUE){ReleaseMutex(mutex);CloseHandle(mutex);return fail(L"Daytone could not write its app files to your local application data folder.");}
 DWORD n=0;BOOL ok=WriteFile(f,daytone_ui,(DWORD)daytone_ui_len,&n,NULL);CloseHandle(f);
 if(!ok||n!=daytone_ui_len||!MoveFileExW(temp,html,MOVEFILE_REPLACE_EXISTING|MOVEFILE_WRITE_THROUGH)){ReleaseMutex(mutex);CloseHandle(mutex);return fail(L"Could not save the Daytone interface. Please close the app and try again.");}ReleaseMutex(mutex);CloseHandle(mutex);
 const wchar_t *envs[]={L"ProgramFiles(x86)",L"ProgramFiles",L"LOCALAPPDATA"};BOOL found=FALSE;
 for(int i=0;i<3;i++){wchar_t root[MAX_PATH];DWORD length=GetEnvironmentVariableW(envs[i],root,MAX_PATH);if(length&&length<MAX_PATH-45){swprintf(edge,MAX_PATH,L"%ls\\Microsoft\\Edge\\Application\\msedge.exe",root);if(GetFileAttributesW(edge)!=INVALID_FILE_ATTRIBUTES){found=TRUE;break;}}}
 if(!found)return fail(L"This demo uses Microsoft Edge to display its app window. Install Microsoft Edge, then launch Daytone again. No Python or Node.js is needed.");
 DWORD urlLength=2048;if(FAILED(UrlCreateFromPathW(html,url,&urlLength,0)))return fail(L"Could not open the app path.");
 swprintf(args,4096,L"--app=\"%ls\" --user-data-dir=\"%ls\" --no-first-run --window-size=1440,1000",url,profile);
 HINSTANCE result=ShellExecuteW(NULL,L"open",edge,args,NULL,SW_SHOWNORMAL);if((INT_PTR)result<=32)return fail(L"Microsoft Edge could not be started. Please try opening Edge directly, then launch Daytone again.");
 return 0;
}
