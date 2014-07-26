require 'spec_helper'
require 'json_spec'
require 'stringio'
require 'plugins/vcs/adapters/git_adapter'

module Jashboard
  module Plugin
    module Vcs
      StubCommit = Struct.new(:oid, :author, :time, :message)
      describe GitAdapter do
        let(:subject) {Object.new.extend GitAdapter}

        describe("VCS runtime info retrieval") do
          let(:repo) {double('repository')}
          let(:walker) {double('walker')}
          let(:branch) {double('branch')}

          before(:each) do
            expect(Rugged::Repository).to receive(:discover).with("test-basedir").and_return(repo)
          end

          context 'non empty repository' do
            shared_examples 'retrieving commits from branch' do |input_branch_name, actual_branch_name|
              commits = [
                StubCommit.new("test-commit_1", {name: "test-committer_1", email: "committer1@test.com"}, "2012-09-10 17:28:34 +1000", "test-message1"),
                StubCommit.new("test-commit_2", {name: "test-committer_2", email: "committer2@test.com"}, "2012-09-13 11:56:19 +1000", "test-message2")
              ]

              before(:each) do
                allow(repo).to receive(:branches).and_return({actual_branch_name => branch})
                allow(branch).to receive(:target_id).and_return('test_sha')
                expect(Rugged::Walker).to receive(:new).with(repo).and_return(walker)
                expect(walker).to receive(:sorting).with(Rugged::SORT_DATE)
                expect(walker).to receive(:push).with('test_sha')
                expect(walker).to receive(:first).with(commits.count).and_return(commits)
              end

              it("retrieves the given number of commits from the #{actual_branch_name} branch") do
                configuration = {
                  working_directory: "test-basedir",
                  history_length: commits.count,
                  branch: input_branch_name,
                  type: "git"
                }.to_struct

                runtime_info = subject.get_git_runtime_info(configuration)
                expect(runtime_info.count).to eq(commits.count)
                commits.each_with_index do |commit, index|
                  expect(runtime_info[index].revision_id).to eq(commit.oid)
                  expect(runtime_info[index].date).to eq(commit.time)
                  expect(runtime_info[index].author).to eq(commit.author[:name])
                  expect(runtime_info[index].email).to eq(commit.author[:email])
                  expect(runtime_info[index].message).to eq(commit.message)
                end
              end
            end

            before(:each) do
              allow(repo).to receive_messages(:empty? => false)
            end

            context 'no branch specified' do
              include_examples 'retrieving commits from branch', nil, 'master'
            end

            context 'empty branch name' do
              include_examples 'retrieving commits from branch', '', 'master'
            end

            context 'non master branch' do
              include_examples 'retrieving commits from branch', 'test-branch', 'test-branch'
            end
          end
        end
      end
    end
  end
end
